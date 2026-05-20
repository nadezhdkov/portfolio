/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function NoiseOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden mix-blend-overlay opacity-[0.035]">
      {/* Dynamic CRT Scanline loop */}
      <div className="absolute inset-0 scanline-overlay select-none" />
      {/* High-frequency analog grain noise */}
      <div className="absolute inset-0 noise-bg select-none" />
    </div>
  );
}
