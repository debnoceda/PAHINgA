import React from 'react';
import '../styles/InputField.css';
import { Icon } from '@iconify/react';

/**
 * InputField Component
 *
 * A reusable styled input component with:
 * - Customizable placeholder, border color, and type.
 * - Error display with icon and message.
 * - Dynamic border color and glow effect on error or focus.
 *
 * Props:
 *  - value: string (controlled input value)
 *  - onChange: function (event handler for input change)
 *  - placeholder: string (input placeholder text)
 *  - borderColor: string (default border color, e.g. '#000000')
 *  - type: string (input type, e.g. 'text', 'email', etc.)
 *  - name: string (input name attribute)
 *  - id: string (input id attribute)
 *  - required: boolean (if input is required)
 *  - className: string (additional CSS classes)
 *  - hasError: boolean (if true, show error styles)
 *  - errorMessage: string (error text to display below input)
 *  - ...props: other standard input props like onBlur, onFocus, etc.
 *
 * Usage example:
 * ```
 * const [value, setValue] = React.useState('');
 * const [error, setError] = React.useState('');
 *
 * const handleChange = (e) => {
 *   setValue(e.target.value);
 *   if (e.target.value.trim() !== '') setError('');
 * };
 *
 * const handleBlur = () => {
 *   if (value.trim() === '') setError('This field is required.');
 * };
 *
 * <InputField
 *   value={value}
 *   onChange={handleChange}
 *   onBlur={handleBlur}
 *   placeholder="Enter your name"
 *   borderColor="#7FB3D5"
 *   hasError={!!error}
 *   errorMessage={error}
 *   required
 * />
 * ```
 */

const InputField = ({
  value = '',
  onChange,
  placeholder = '',
  borderColor = '#7FB3D5',
  type = 'text',
  name,
  id,
  required = false,
  className = '',
  hasError = false,
  errorMessage = '',
  ...props
}) => {
  const fallbackId = React.useMemo(() =>
    `input-field-${Math.random().toString(36).slice(2, 11)}`,
    []
  );

  const inputId = id || fallbackId;

  const inputName = name || inputId;

  const style = {
    '--border-color': hasError ? '#D57F80' : borderColor,
    '--box-shadow': hasError ? '0 0 5px 0.5px rgba(213, 127, 128, 0.7)' : 'none',
  };

  return (
    <div style={{ width: '100%', marginBottom: '1rem' }}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        name={inputName}
        id={inputId}
        required={required}
        className={`custom-input ${className}`}
        style={style}
        {...props}
      />
      {hasError && (
        <p className="error-text small-text">
          <Icon icon="ci:circle-warning" width="16" height="16" />
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default InputField;
