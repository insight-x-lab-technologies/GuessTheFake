import QRCode from 'qrcode';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  createInitialMultiplayerSessionState,
  createInviteUrl,
  createSessionStateMessage,
  createWebRtcSignalPayload,
  disconnectMultiplayerSession,
  exportMultiplayerSnapshot,
  hostMultiplayerSession,
  importMultiplayerSnapshot,
  joinMultiplayerSession,
  loadMultiplayerSession,
  normalizeSessionCode,
  parseMultiplayerMessage,
  parseWebRtcSignalPayload,
  reduceMultiplayerMessage,
  saveMultiplayerSession,
  serializeMultiplayerMessage,
  serializeWebRtcSignalPayload,
  updateMultiplayerPeerStatus,
  type MultiplayerGameSnapshot,
  type MultiplayerMessage,
  type MultiplayerTransportKind
} from '../../core/multiplayer/multiplayer';
import type { Translate } from '../app-types';
import { copyTextToClipboard, downloadJson } from '../browser';
import {
  createSessionQrCells,
  getIceServers,
  getMultiplayerChannelName,
  supportsBroadcastChannel,
  supportsWebRtc,
  waitForIceGatheringComplete
} from '../peer-connection';

export type MultiDeviceController = ReturnType<typeof useMultiDevice>;

function getPreferredTransport(): MultiplayerTransportKind {
  if (supportsWebRtc()) return 'webrtc-manual';
  if (supportsBroadcastChannel()) return 'broadcast-channel';
  return 'manual-offline';
}

// Companion-screen session: BroadcastChannel between tabs, manual WebRTC
// offer/answer between devices, and offline snapshots. No server involved.
export function useMultiDevice({
  t,
  hostSnapshot,
  onInviteLinkOpened
}: {
  t: Translate;
  hostSnapshot: MultiplayerGameSnapshot;
  onInviteLinkOpened: () => void;
}) {
  const channelRef = useRef<BroadcastChannel | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const peerDataChannelRef = useRef<RTCDataChannel | null>(null);
  const peerSessionCodeRef = useRef('');
  const autoJoinHandledRef = useRef(false);
  const guestIdRef = useRef(
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? `guest-${crypto.randomUUID()}`
      : `guest-${Math.random().toString(36).slice(2, 10)}`
  );
  const [session, setSession] = useState(() => {
    if (typeof localStorage === 'undefined') return createInitialMultiplayerSessionState();
    return loadMultiplayerSession();
  });
  const [status, setStatus] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [manualSnapshotInput, setManualSnapshotInput] = useState('');
  const [signalInput, setSignalInput] = useState('');
  const [signalOutput, setSignalOutput] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  // Data-channel callbacks fire long after they are wired up.
  const latestRef = useRef({ session, joinCodeInput, hostSnapshot });
  latestRef.current = { session, joinCodeInput, hostSnapshot };

  const canUseBroadcastChannel = supportsBroadcastChannel();
  const canUseWebRtc = supportsWebRtc();
  const mirroredSnapshot = session.role === 'guest' ? session.lastSnapshot : hostSnapshot;
  const inviteUrl = session.sessionCode && typeof window !== 'undefined'
    ? createInviteUrl(window.location.href, session.sessionCode)
    : '';
  const qrCells = useMemo(
    () => createSessionQrCells(session.sessionCode || 'GTF-LOCAL'),
    [session.sessionCode]
  );

  useEffect(() => {
    saveMultiplayerSession(session);
  }, [session]);

  useEffect(() => {
    let cancelled = false;
    if (!inviteUrl) {
      setQrDataUrl('');
      return undefined;
    }

    QRCode.toDataURL(inviteUrl, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 180,
      color: {
        dark: '#111827',
        light: '#ffffff'
      }
    })
      .then(dataUrl => {
        if (!cancelled) setQrDataUrl(dataUrl);
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl('');
      });

    return () => {
      cancelled = true;
    };
  }, [inviteUrl]);

  useEffect(() => {
    if (autoJoinHandledRef.current || typeof window === 'undefined') return;
    const code = new URL(window.location.href).searchParams.get('join');
    if (!code) return;
    autoJoinHandledRef.current = true;
    connect(code);
    onInviteLinkOpened();
    // Runs once for the invite link present at boot.
  }, []);

  useEffect(() => {
    return () => closePeerConnection();
  }, []);

  useEffect(() => {
    channelRef.current?.close();
    channelRef.current = null;

    if (!session.sessionCode || !canUseBroadcastChannel || session.status === 'idle') return undefined;

    const channel = new BroadcastChannel(getMultiplayerChannelName(session.sessionCode));
    channelRef.current = channel;
    channel.onmessage = event => {
      const message = typeof event.data === 'string'
        ? parseMultiplayerMessage(event.data)
        : parseMultiplayerMessage(JSON.stringify(event.data));
      if (!message) return;
      setSession(current => reduceMultiplayerMessage(current, message));
    };

    if (session.role === 'guest') {
      const ready = joinMultiplayerSession(session, session.sessionCode, {
        guestId: guestIdRef.current
      }).message;
      if (ready) channel.postMessage(serializeMultiplayerMessage(ready));
    }

    return () => {
      channel.close();
      if (channelRef.current === channel) channelRef.current = null;
    };
  }, [canUseBroadcastChannel, session.role, session.sessionCode, session.status]);

  useEffect(() => {
    if (session.role !== 'host' || session.status !== 'hosting' || !session.sessionCode) return;
    postMessage(createSessionStateMessage(session.sessionCode, hostSnapshot));
    setSession(current => ({ ...current, lastSnapshot: hostSnapshot, updatedAt: hostSnapshot.updatedAt }));
  }, [hostSnapshot, session.role, session.sessionCode, session.status]);

  function postMessage(message: MultiplayerMessage) {
    if (peerDataChannelRef.current?.readyState === 'open') {
      peerDataChannelRef.current.send(serializeMultiplayerMessage(message));
    }
    if (!supportsBroadcastChannel()) return;
    const channel = channelRef.current ?? new BroadcastChannel(getMultiplayerChannelName(message.sessionCode));
    channel.postMessage(serializeMultiplayerMessage(message));
    if (!channelRef.current) channel.close();
  }

  function host() {
    const transport = getPreferredTransport();
    const hosted = hostMultiplayerSession(session, { transport });
    setSession({ ...hosted, lastSnapshot: hostSnapshot });
    setStatus(t(transport === 'webrtc-manual' ? 'multiDevice.peerReady' : transport === 'broadcast-channel' ? 'multiDevice.hostReady' : 'multiDevice.offlineReady'));
  }

  function connect(value = joinCodeInput) {
    const joined = joinMultiplayerSession(session, value, {
      guestId: guestIdRef.current,
      transport: getPreferredTransport()
    });
    setSession(joined.state);
    if (joined.message) postMessage(joined.message);
    setJoinCodeInput(joined.state.sessionCode);
    setStatus(t(joined.message ? 'multiDevice.joined' : 'multiDevice.missingCode'));
  }

  function disconnect() {
    const disconnected = disconnectMultiplayerSession(session, { guestId: guestIdRef.current });
    if (disconnected.message) postMessage(disconnected.message);
    closePeerConnection();
    setSignalInput('');
    setSignalOutput('');
    setSession(disconnected.state);
    setStatus(t('multiDevice.disconnected'));
  }

  async function createPeerOffer() {
    if (!canUseWebRtc) {
      setStatus(t('multiDevice.peerUnavailable'));
      setSession(current => updateMultiplayerPeerStatus(current, 'failed', { error: 'peer-unavailable' }));
      return;
    }
    const hosted = hostMultiplayerSession(session, { transport: 'webrtc-manual' });
    const sessionCode = session.sessionCode || hosted.sessionCode;
    try {
      closePeerConnection();
      peerSessionCodeRef.current = hosted.sessionCode || sessionCode;
      const peer = createPeerConnection('host');
      const channel = peer.createDataChannel('guess-the-fake-session');
      configurePeerDataChannel(channel, 'host');
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      await waitForIceGatheringComplete(peer);
      const payload = createWebRtcSignalPayload('offer', hosted.sessionCode || sessionCode, peer.localDescription?.sdp ?? offer.sdp ?? '');
      setSignalOutput(serializeWebRtcSignalPayload(payload));
      setSession({ ...hosted, sessionCode: payload.sessionCode, lastSnapshot: hostSnapshot, peerStatus: 'signaling' });
      setStatus(t('multiDevice.offerCreated'));
    } catch {
      closePeerConnection();
      setSession(current => updateMultiplayerPeerStatus(current, 'failed', { error: 'peer-offer-failed' }));
      setStatus(t('multiDevice.offerFailed'));
    }
  }

  async function createPeerAnswer() {
    const payload = parseWebRtcSignalPayload(signalInput);
    if (!payload || payload.kind !== 'offer') {
      setStatus(t('multiDevice.offerInvalid'));
      return;
    }
    if (!canUseWebRtc) {
      setStatus(t('multiDevice.peerUnavailable'));
      return;
    }

    try {
      closePeerConnection();
      peerSessionCodeRef.current = payload.sessionCode;
      const peer = createPeerConnection('guest');
      await peer.setRemoteDescription({ type: 'offer', sdp: payload.sdp });
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      await waitForIceGatheringComplete(peer);
      const answerPayload = createWebRtcSignalPayload('answer', payload.sessionCode, peer.localDescription?.sdp ?? answer.sdp ?? '');
      setSignalOutput(serializeWebRtcSignalPayload(answerPayload));
      const joined = joinMultiplayerSession(session, payload.sessionCode, {
        guestId: guestIdRef.current,
        transport: 'webrtc-manual'
      });
      setJoinCodeInput(payload.sessionCode);
      setSession({ ...joined.state, peerStatus: 'connecting' });
      setStatus(t('multiDevice.answerCreated'));
    } catch {
      closePeerConnection();
      setSession(current => updateMultiplayerPeerStatus(current, 'failed', { error: 'peer-answer-failed' }));
      setStatus(t('multiDevice.answerFailed'));
    }
  }

  async function applyPeerAnswer() {
    const payload = parseWebRtcSignalPayload(signalInput);
    if (!payload || payload.kind !== 'answer') {
      setStatus(t('multiDevice.answerInvalid'));
      return;
    }
    if (!peerConnectionRef.current) {
      setStatus(t('multiDevice.offerFirst'));
      return;
    }
    if (normalizeSessionCode(payload.sessionCode) !== normalizeSessionCode(session.sessionCode)) {
      setStatus(t('multiDevice.signalWrongSession'));
      return;
    }

    try {
      await peerConnectionRef.current.setRemoteDescription({ type: 'answer', sdp: payload.sdp });
      setSession(current => updateMultiplayerPeerStatus(current, 'connecting', { error: null }));
      setStatus(t('multiDevice.answerApplied'));
    } catch {
      setSession(current => updateMultiplayerPeerStatus(current, 'failed', { error: 'peer-answer-apply-failed' }));
      setStatus(t('multiDevice.answerFailed'));
    }
  }

  function resetPeerConnection() {
    closePeerConnection();
    peerSessionCodeRef.current = '';
    setSignalInput('');
    setSignalOutput('');
    setSession(current => updateMultiplayerPeerStatus(current, current.status === 'idle' ? 'idle' : 'signaling', { error: null }));
    setStatus(t('multiDevice.peerReset'));
  }

  function createPeerConnection(role: 'host' | 'guest') {
    const peer = new RTCPeerConnection({ iceServers: getIceServers() });
    peerConnectionRef.current = peer;

    peer.onconnectionstatechange = () => {
      const nextStatus = peer.connectionState === 'connected'
        ? 'connected'
        : peer.connectionState === 'failed'
          ? 'failed'
          : peer.connectionState === 'disconnected' || peer.connectionState === 'closed'
            ? 'disconnected'
            : 'connecting';
      setSession(current => updateMultiplayerPeerStatus(current, nextStatus, {
        error: nextStatus === 'failed' ? 'peer-connection-failed' : null
      }));
      if (nextStatus === 'failed') setStatus(t('multiDevice.peerFailed'));
    };

    if (role === 'guest') {
      peer.ondatachannel = event => configurePeerDataChannel(event.channel, 'guest');
    }

    return peer;
  }

  function configurePeerDataChannel(channel: RTCDataChannel, role: 'host' | 'guest') {
    peerDataChannelRef.current = channel;
    channel.onopen = () => {
      const latest = latestRef.current;
      const sessionCode = peerSessionCodeRef.current || latest.session.sessionCode || latest.joinCodeInput;
      setSession(current => updateMultiplayerPeerStatus(current, 'connected', { error: null }));
      setStatus(t('multiDevice.peerConnected'));
      if (role === 'guest') {
        const ready = joinMultiplayerSession(latest.session, sessionCode, {
          guestId: guestIdRef.current,
          transport: 'webrtc-manual'
        }).message;
        if (ready) channel.send(serializeMultiplayerMessage(ready));
      } else if (sessionCode) {
        channel.send(serializeMultiplayerMessage(createSessionStateMessage(sessionCode, latest.hostSnapshot)));
      }
    };
    channel.onclose = () => {
      setSession(current => updateMultiplayerPeerStatus(current, current.status === 'idle' ? 'idle' : 'disconnected'));
    };
    channel.onerror = () => {
      setSession(current => updateMultiplayerPeerStatus(current, 'failed', { error: 'peer-data-channel-failed' }));
      setStatus(t('multiDevice.peerFailed'));
    };
    channel.onmessage = event => {
      const raw = typeof event.data === 'string' ? event.data : '';
      const message = parseMultiplayerMessage(raw);
      if (!message) return;
      setSession(current => reduceMultiplayerMessage(current, message));
    };
  }

  function closePeerConnection() {
    peerDataChannelRef.current?.close();
    peerConnectionRef.current?.close();
    peerDataChannelRef.current = null;
    peerConnectionRef.current = null;
  }

  async function copyText(value: string, statusKey: string) {
    if (!value) return;
    try {
      await copyTextToClipboard(value);
      setStatus(t(statusKey));
    } catch {
      setStatus(value);
    }
  }

  function downloadSnapshot() {
    downloadJson('guess-the-fake-session-snapshot.json', exportMultiplayerSnapshot(hostSnapshot));
    setStatus(t('multiDevice.snapshotExported'));
  }

  function applyManualSnapshot() {
    const snapshot = importMultiplayerSnapshot(manualSnapshotInput);
    if (!snapshot) {
      setStatus(t('multiDevice.snapshotInvalid'));
      return;
    }
    setSession(current => ({
      ...current,
      role: 'guest',
      status: 'offline',
      transport: 'manual-offline',
      lastSnapshot: snapshot,
      updatedAt: snapshot.updatedAt,
      error: null
    }));
    setStatus(t('multiDevice.snapshotImported'));
  }

  return {
    session,
    status,
    canUseWebRtc,
    mirroredSnapshot,
    inviteUrl,
    qrDataUrl,
    qrCells,
    joinCodeInput,
    setJoinCodeInput,
    manualSnapshotInput,
    setManualSnapshotInput,
    signalInput,
    setSignalInput,
    signalOutput,
    host,
    connect,
    disconnect,
    createPeerOffer,
    createPeerAnswer,
    applyPeerAnswer,
    resetPeerConnection,
    copyText,
    downloadSnapshot,
    applyManualSnapshot
  };
}
