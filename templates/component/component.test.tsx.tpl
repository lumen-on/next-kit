import { render, screen } from '@testing-library/react';
import { {{Name}} } from './{{name}}';

describe('{{Name}}', () => {
  it('renders correctly', () => {
    render(<{{Name}}>Test</{{Name}}>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
