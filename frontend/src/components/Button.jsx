import React from 'react';
import '../styles/Button.css';

/**
 * Button Component
 *
 * A versatile button component with 3 style variants:
 *
 * Style types:
 * - 'medium-compact': Medium-sized button with rounded corners, full width, blue background, white text.
 * - 'small-compact': Small-sized button with rounded corners, full width, green background, dark text.
 * - 'text-only': Text-only button with customizable underline and opacity styles.
 *
 * Props:
 * - type: string ('medium-compact' | 'small-compact' | 'text-only'), default 'medium-compact'
 * - underline: boolean (only for 'text-only'), adds underline text decoration when true
 * - opacity: boolean (only for 'text-only'), applies 25% opacity to text color when true
 * - fontColor: string (CSS color value)
 * - children: ReactNode, the button label or content
 * - onClick: function, click event handler
 * - disabled: boolean, disables the button when true
 * - className: string, additional CSS classes to apply
 * - ...props: other native button props (type, aria attributes, etc.)
 *
 * Usage Examples:
 *
 * 1. Medium compact button (default)
 * <Button onClick={() => alert('Clicked!')}>Submit</Button>
 *
 * 2. Small compact button
 * <Button type="small-compact" fontColor="#123456" onClick={handleClick}>Cancel</Button>
 *
 * 3. Text-only button with underline
 * <Button type="text-only" underline onClick={handleClick}>Learn more</Button>
 *
 * 4. Text-only button with opacity (lighter text)
 * <Button type="text-only" opacity onClick={handleClick}>Dismiss</Button>
 */

const Button = ({
  type = 'medium-compact', // 'medium-compact' | 'small-compact' | 'text-only'
  underline = false,             // for text-only only
  opacity = false,               // for text-only only
  fontColor,
  children,
  onClick,
  disabled = false,
  className = '',
  ...props
}) => {
  const classes = ['custom-button', type];

  if (type === 'text-only') {
    if (underline) classes.push('underline');
    if (opacity) classes.push('opacity');
  }

  if (className) classes.push(className);

  return (
    <button
      className={classes.join(' ')}
      onClick={onClick}
      disabled={disabled}
      style={fontColor ? { color: fontColor } : undefined}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
