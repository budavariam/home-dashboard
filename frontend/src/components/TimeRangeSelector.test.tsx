import { render, screen, fireEvent } from '@testing-library/react';
import { TimeRangeSelector } from './TimeRangeSelector';

describe('TimeRangeSelector', () => {
    it('renders with default value', () => {
        const mockOnChange = jest.fn();
        render(<TimeRangeSelector value="6h" onChange={mockOnChange} />);

        const select = screen.getByRole('combobox');
        expect(select).toHaveValue('6h');
    });

    it('calls onChange when value changes', () => {
        const mockOnChange = jest.fn();
        render(<TimeRangeSelector value="6h" onChange={mockOnChange} />);

        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: '24h' } });

        expect(mockOnChange).toHaveBeenCalledWith('24h');
    });

    it('renders all time range options', () => {
        const mockOnChange = jest.fn();
        render(<TimeRangeSelector value="6h" onChange={mockOnChange} />);

        const options = screen.getAllByRole('option');
        expect(options).toHaveLength(7);
        expect(screen.getByText('Last 1 Hour')).toBeInTheDocument();
        expect(screen.getByText('Last 6 Hours')).toBeInTheDocument();
        expect(screen.getByText('Past 2 Weeks')).toBeInTheDocument();
    });

    it('applies custom className', () => {
        const mockOnChange = jest.fn();
        render(<TimeRangeSelector value="6h" onChange={mockOnChange} className="custom-class" />);

        const select = screen.getByRole('combobox');
        expect(select).toHaveClass('custom-class');
    });
});