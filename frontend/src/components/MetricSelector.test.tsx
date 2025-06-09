import { render, screen, fireEvent } from '@testing-library/react';
import { MetricSelector } from './MetricSelector';

describe('MetricSelector', () => {
  const defaultMetrics = {
    hum: true,
    tmp: false,
    bat: true,
  };

  it('renders all metric checkboxes', () => {
    const mockOnChange = jest.fn();
    render(<MetricSelector selectedMetrics={defaultMetrics} onChange={mockOnChange} />);
    
    expect(screen.getByLabelText(/Humidity/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Temperature/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Battery/)).toBeInTheDocument();
  });

  it('shows correct checked state', () => {
    const mockOnChange = jest.fn();
    render(<MetricSelector selectedMetrics={defaultMetrics} onChange={mockOnChange} />);
    
    expect(screen.getByLabelText(/Humidity/)).toBeChecked();
    expect(screen.getByLabelText(/Temperature/)).not.toBeChecked();
    expect(screen.getByLabelText(/Battery/)).toBeChecked();
  });

  it('calls onChange when checkbox is toggled', () => {
    const mockOnChange = jest.fn();
    render(<MetricSelector selectedMetrics={defaultMetrics} onChange={mockOnChange} />);
    
    const tempCheckbox = screen.getByLabelText(/Temperature/);
    fireEvent.click(tempCheckbox);
    
    expect(mockOnChange).toHaveBeenCalledWith({
      hum: true,
      tmp: true,
      bat: true,
    });
  });
});
