import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import App from './App';
import Header from './components/header'
import Body from './components/body'
import RegisterForm from './components/common/form'




describe('renders Cocreators Application', () => {
  render(<App />);
  const linkElement = screen.getByText(/Cocreators/i);
  expect(linkElement).toBeInTheDocument();
});




describe('< Header/>', ()=>{
  it('render without crashing', ()=>{
    render(< Header/>)
  })
  it('render site logo', ()=>{
    render(< Header/>)
    const logo = screen.getByText(/Cocreators/)
    expect(logo).toBeInTheDocument();
  })
})




describe('<Body/>', ()=>{
  it('render without crashing', async()=>{
    render(<Body/>);
    const title = screen.getByText(/Domain/i);
    const status = screen.getByText(/Status/i);
    expect(title).toBeInTheDocument();
    expect(status).toBeInTheDocument();
  })

  it('render form when add button is clicked',  async()=>{
    render(<Body/>);
    const buttonEl = screen.getByText(/Add/i);
    userEvent.click(buttonEl);
    const linkElement = screen.getByText(/submit/i);
    expect(linkElement).toBeInTheDocument();
  })
})



describe('<RegisterForm />', ()=>{
  it('render without crashing', ()=>{
    render(<RegisterForm />)
  })
  it('test form submission', ()=>{
    const onSubmit = jest.fn();
    const { getByText } = render(<RegisterForm onsubmit={onSubmit}/>)
    fireEvent.click(getByText("Submit"));
    expect(onSubmit).toHaveBeenCalled();
  })
})
