import { CheckCircle2, Clock, Copy, Download, Link2, ListChecks, QrCode, Radio, RotateCcw, Unplug, Upload, Wifi } from 'lucide-react';
import { Button } from '../../core/ui/Button';
import type { Translate } from '../app-types';
import type { MultiDeviceController } from '../hooks/useMultiDevice';
import { ScreenHeader } from './ScreenHeader';
import styles from '../App.module.css';

export function MultiDeviceScreen({ t, multiDevice }: { t: Translate; multiDevice: MultiDeviceController }) {
  const { session, mirroredSnapshot: snapshot, canUseWebRtc } = multiDevice;

  return (
    <section className={styles.panel}>
      <ScreenHeader
        screen="multiDevice"
        title={t('multiDevice.title')}
        aside={(
          <div className={styles.sessionCode}>
            {session.status === 'idle' ? <Unplug size={16} /> : <Wifi size={16} />}
            {t(`multiDevice.${session.status}`)}
          </div>
        )}
      >
        <p>{t('multiDevice.subtitle')}</p>
      </ScreenHeader>
      {multiDevice.status ? <p className={styles.helperText}>{multiDevice.status}</p> : null}
      <div className={styles.multiDeviceGrid}>
        <article className={styles.smallCard}>
          <Radio size={24} />
          <h3 className={styles.cardTitle}>{t('multiDevice.host')}</h3>
          <p>{t('multiDevice.hostDescription')}</p>
          {session.role === 'host' && session.sessionCode ? (
            <>
              <div className={styles.sessionCode}>{session.sessionCode}</div>
              <div className={styles.qrPanel} aria-label={t('multiDevice.qrLabel')}>
                {multiDevice.qrDataUrl ? (
                  <img src={multiDevice.qrDataUrl} alt={t('multiDevice.qrLabel')} />
                ) : (
                  <>
                    <QrCode size={24} />
                    <div className={styles.qrGrid} aria-hidden="true">
                      {multiDevice.qrCells.map((active, index) => (
                        <span key={index} data-active={active ? 'true' : 'false'} />
                      ))}
                    </div>
                  </>
                )}
              </div>
              <label className={styles.field}>
                <span>{t('multiDevice.inviteLink')}</span>
                <input value={multiDevice.inviteUrl} readOnly />
              </label>
              <div className={styles.compactRows}>
                <span>
                  <b>{t('multiDevice.connectedGuests')}</b>
                  {session.guests.length}
                </span>
                <span>
                  <b>{t('multiDevice.transportLabel')}</b>
                  {t(`multiDevice.transport.${session.transport}`)}
                </span>
                <span>
                  <b>{t('multiDevice.peerStatusLabel')}</b>
                  {t(`multiDevice.peerStatus.${session.peerStatus}`)}
                </span>
              </div>
              <div className={styles.actionCluster}>
                <Button variant="ghost" icon={<Copy size={18} />} onClick={() => multiDevice.copyText(multiDevice.inviteUrl, 'multiDevice.linkCopied')}>
                  {t('multiDevice.copyLink')}
                </Button>
                <Button variant="secondary" icon={<Download size={18} />} onClick={multiDevice.downloadSnapshot}>
                  {t('multiDevice.exportSnapshot')}
                </Button>
                <Button variant="danger" icon={<Unplug size={18} />} onClick={multiDevice.disconnect}>
                  {t('multiDevice.disconnect')}
                </Button>
              </div>
            </>
          ) : (
            <Button variant="secondary" icon={<Radio size={18} />} onClick={multiDevice.host}>
              {t('multiDevice.host')}
            </Button>
          )}
        </article>
        <article className={styles.smallCard}>
          <ListChecks size={24} />
          <h3 className={styles.cardTitle}>{t('multiDevice.join')}</h3>
          <p>{t('multiDevice.joinDescription')}</p>
          <label className={styles.field}>
            <span>{t('multiDevice.code')}</span>
            <input
              placeholder="GTF-ABC123"
              value={multiDevice.joinCodeInput}
              onChange={event => multiDevice.setJoinCodeInput(event.target.value)}
              onKeyDown={event => {
                if (event.key === 'Enter') multiDevice.connect();
              }}
            />
          </label>
          <div className={styles.actionCluster}>
            <Button variant="secondary" icon={<Link2 size={18} />} onClick={() => multiDevice.connect()}>
              {t('multiDevice.join')}
            </Button>
            {session.role === 'guest' ? (
              <Button variant="danger" icon={<Unplug size={18} />} onClick={multiDevice.disconnect}>
                {t('multiDevice.disconnect')}
              </Button>
            ) : null}
          </div>
          <label className={styles.field}>
            <span>{t('multiDevice.manualSnapshot')}</span>
            <textarea
              className={styles.snapshotInput}
              value={multiDevice.manualSnapshotInput}
              onChange={event => multiDevice.setManualSnapshotInput(event.target.value)}
              placeholder={t('multiDevice.manualSnapshotPlaceholder')}
            />
          </label>
          <Button variant="ghost" icon={<Upload size={18} />} onClick={multiDevice.applyManualSnapshot}>
            {t('multiDevice.applySnapshot')}
          </Button>
        </article>
        <article className={styles.smallCard}>
          <Wifi size={24} />
          <h3 className={styles.cardTitle}>{t('multiDevice.peerTitle')}</h3>
          <p>{t('multiDevice.peerDescription')}</p>
          <div className={styles.compactRows}>
            <span>
              <b>{t('multiDevice.peerSupport')}</b>
              {canUseWebRtc ? t('multiDevice.available') : t('multiDevice.unavailable')}
            </span>
            <span>
              <b>{t('multiDevice.peerStatusLabel')}</b>
              {t(`multiDevice.peerStatus.${session.peerStatus}`)}
            </span>
          </div>
          <label className={styles.field}>
            <span>{t('multiDevice.signalOutput')}</span>
            <textarea
              className={styles.snapshotInput}
              value={multiDevice.signalOutput}
              readOnly
              placeholder={t('multiDevice.signalOutputPlaceholder')}
            />
          </label>
          <div className={styles.actionCluster}>
            <Button variant="secondary" icon={<Radio size={18} />} onClick={multiDevice.createPeerOffer} disabled={!canUseWebRtc}>
              {t('multiDevice.createOffer')}
            </Button>
            <Button
              variant="ghost"
              icon={<Copy size={18} />}
              onClick={() => multiDevice.copyText(multiDevice.signalOutput, 'multiDevice.signalCopied')}
              disabled={!multiDevice.signalOutput}
            >
              {t('multiDevice.copySignal')}
            </Button>
          </div>
          <label className={styles.field}>
            <span>{t('multiDevice.signalInput')}</span>
            <textarea
              className={styles.snapshotInput}
              value={multiDevice.signalInput}
              onChange={event => multiDevice.setSignalInput(event.target.value)}
              placeholder={t('multiDevice.signalInputPlaceholder')}
            />
          </label>
          <div className={styles.actionCluster}>
            <Button variant="secondary" icon={<Link2 size={18} />} onClick={multiDevice.createPeerAnswer} disabled={!canUseWebRtc}>
              {t('multiDevice.createAnswer')}
            </Button>
            <Button variant="ghost" icon={<CheckCircle2 size={18} />} onClick={multiDevice.applyPeerAnswer} disabled={!canUseWebRtc}>
              {t('multiDevice.applyAnswer')}
            </Button>
            <Button variant="danger" icon={<RotateCcw size={18} />} onClick={multiDevice.resetPeerConnection}>
              {t('multiDevice.resetPeer')}
            </Button>
          </div>
        </article>
        <article className={`${styles.smallCard} ${styles.companionPanel}`}>
          <Clock size={24} />
          <h3 className={styles.cardTitle}>{t('multiDevice.localPanel')}</h3>
          {snapshot ? (
            <>
              <div className={styles.timerRing}>
                <strong>{snapshot.timerSeconds}</strong>
                <span>{t('game.secondsLabel')}</span>
              </div>
              <p>{t('multiDevice.roundStatus', {
                current: snapshot.roundNumber,
                total: snapshot.totalRounds,
                phase: t(`multiDevice.phase.${snapshot.phase}`)
              })}</p>
              <div className={styles.sessionCode}>
                {snapshot.revealed ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                {snapshot.activeSubjectName}
              </div>
              <div className={styles.compactRows}>
                {snapshot.scoreboard.map(row => (
                  <span key={row.name}>
                    <b>{row.name}</b>
                    {row.score}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p>{t('multiDevice.waiting')}</p>
          )}
        </article>
      </div>
    </section>
  );
}
