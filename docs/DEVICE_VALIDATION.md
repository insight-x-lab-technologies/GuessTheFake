# Device Layout Validation

This file records the responsive viewports used for manual/headless layout
validation. Values are CSS pixels, not physical hardware pixels.

## Viewports Tested

| Device | Portrait | Landscape |
| --- | ---: | ---: |
| iPhone 17 | 402 x 874 | 874 x 402 |
| iPhone 17 Max / Pro Max class | 440 x 956 | 956 x 440 |
| Galaxy Tab S9 | 753 x 1205 | 1205 x 753 |
| iPad 10 | 820 x 1180 | 1180 x 820 |

## Screens Validated

- Home / app shell.
- Active game board via `?demo=game`.

## Findings Applied

- Added a compact low-height landscape mode for phone-wide layouts.
- Kept the hero CTA visible on iPhone landscape.
- Limited mobile content width to prevent horizontal overflow.
- Removed mobile statement text clamping so game cards wrap naturally.
- Changed the game board to fill the available app main area instead of
  recalculating against the full viewport after tablet navigation is added.
- Wave 3 validation added mobile portrait bottom tabs, compact landscape
  navigation, neutral home preview cards, and WebP background assets.
- Verified the mobile nav computed as viewport-fixed after removing the mobile
  sidebar backdrop-filter containment issue.

## Notes

Android tablet CSS viewports can vary with browser zoom, display scaling, and
system settings. The Galaxy Tab S9 validation uses a representative CSS viewport
derived from the common 1600 x 2560 physical resolution at a tablet-scale DPR.
