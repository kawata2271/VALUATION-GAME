import React from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { MonthlySnapshot } from '../../engine/types';

interface Props {
  data: MonthlySnapshot[];
  dataKey: keyof MonthlySnapshot;
  color?: string;
  height?: number;
}

export const MiniChart: React.FC<Props> = ({ data, dataKey, color = '#00c896', height = 60 }) => {
  const last24 = data.slice(-24);
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={last24}>
        <defs>
          <linearGradient id={`grad_${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Tooltip
          contentStyle={{ background: '#1a1a2e', border: '1px solid #333', borderRadius: 6, fontSize: 12 }}
          labelFormatter={(v) => `Month ${v}`}
          formatter={(v: any) => [`$${Number(v).toLocaleString()}`, '']}
        />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          fill={`url(#grad_${dataKey})`}
          strokeWidth={2}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
