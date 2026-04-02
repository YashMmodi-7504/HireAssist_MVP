import React from "react";
import { COLORS, FONTS } from "../theme";

export default function PageHeader({ title, subtitle, lastUpdated }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: FONTS.headingWeight }}>{title}</h1>
        {subtitle && <div style={{ marginTop: 6, color: COLORS.muted }}>{subtitle}</div>}
      </div>

      <div style={{ textAlign: 'right', color: COLORS.muted, fontSize: 12 }}>
        {lastUpdated ? (Date.now() - lastUpdated < 60000 ? 'Last updated just now' : `Last updated ${new Date(lastUpdated).toLocaleString()}`) : ''}
      </div>
    </div>
  );
}