export const BarChart = ({ children, ...props }: any) => {
  // Remove any non-string/non-number props that would be invalid on a div
  const { label, ...validProps } = props
  return <div {...validProps}>{children}</div>
}

export const Bar = ({ ...props }: any) => {
  // Remove any non-string/non-number props that would be invalid on a div
  const { label, dataKey, fill, ...validProps } = props
  return <div {...validProps} />
}

export const XAxis = ({ ...props }: any) => {
  // Remove any non-string/non-number props that would be invalid on a div
  const { dataKey, ...validProps } = props
  return <div {...validProps} />
}

export const YAxis = ({ ...props }: any) => {
  return <div {...props} />
}

export const CartesianGrid = ({ ...props }: any) => {
  return <div {...props} />
}

export const Tooltip = ({ ...props }: any) => {
  // Remove any non-string/non-number props that would be invalid on a div
  const { formatter, ...validProps } = props
  return <div {...validProps} />
}

export const ResponsiveContainer = ({ children, ...props }: any) => {
  return <div {...props}>{children}</div>
}

export const PieChart = ({ children, ...props }: any) => {
  return <div {...props}>{children}</div>
}

export const Pie = ({ children, ...props }: any) => {
  // Remove any non-string/non-number props that would be invalid on a div
  const { data, cx, cy, labelLine, outerRadius, fill, dataKey, label, ...validProps } = props
  return <div {...validProps}>{children}</div>
}

export const Cell = ({ ...props }: any) => {
  // Remove any non-string/non-number props that would be invalid on a div
  const { fill, ...validProps } = props
  return <div {...validProps} />
}

export const Legend = ({ ...props }: any) => {
  return <div {...props} />
}
