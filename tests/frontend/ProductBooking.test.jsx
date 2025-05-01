import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProductbookingPage from '../../frontend/components/ProductbookingPage';

global.fetch = jest.fn();
Object.defineProperty(document, 'cookie', {
    writable: true,
    value: 'user_id=testUserId',
});

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({ product_id: '1' }),
    useNavigate: () => mockedNavigate,
    useLocation: () => ({
        search: '?frombookingdate=2025-04-30T10:00&tobookingdate=2025-04-30T13:00',
    }),
}));

beforeEach(() => {
    fetch.mockReset();
    mockedNavigate.mockReset();
});

function renderComponent() {
    render(
        <MemoryRouter initialEntries={['/productbooking/1?frombookingdate=2025-04-30T10:00&tobookingdate=2025-04-30T13:00']}>
            <Routes>
                <Route path="/productbooking/:product_id" element={<ProductbookingPage />} />
            </Routes>
        </MemoryRouter>
    );
}

function setupFetchSuccess() {
    fetch.mockImplementation((url) => {
        if (url.includes('/product/')) {
            return Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({
                        productName: 'Camera',
                        productType: 'Electronics',
                        photo: ['https://example.com/camera.jpg'],
                        locationName: 'Hyderabad',
                        price: 100,
                    }),
            });
        } else if (url.includes('/booking')) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ message: 'Booking Successful!' }),
            });
        } else if (url.includes('/grabCustomernameProductId')) {
            return Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({
                        ownerName: 'Owner',
                        ownerEmail: 'owner@example.com',
                        buyerName: 'Buyer',
                        buyerEmail: 'buyer@example.com',
                        productName: 'Camera',
                        productType: 'Electronics',
                        fromDate: new Date(),
                        toDate: new Date(),
                        bookingDate: new Date(),
                    }),
            });
        } else if (url.includes('/send-email')) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ message: 'Email sent successfully' }),
            });
        }
        return Promise.reject(new Error('Unhandled fetch'));
    });
}

describe('ProductbookingPage Tests', () => {
    test('1. Renders product details correctly', async () => {
        setupFetchSuccess();
        renderComponent();

        expect(await screen.findByText('Camera')).toBeInTheDocument();
        expect(screen.getByText('Hyderabad')).toBeInTheDocument();
        expect(screen.getByText(/Fare:/)).toBeInTheDocument();
    });

    test('2. Completes booking when Pay Now is clicked', async () => {
        setupFetchSuccess();
        renderComponent();

        const payNowBtn = await screen.findByText(/Pay Now/i);
        fireEvent.click(payNowBtn);

        await waitFor(() => {
            expect(screen.getByText(/Booking Successful/i)).toBeInTheDocument();
        });
    });

    test('3. Shows error if booking fails', async () => {
        fetch.mockImplementation((url) => {
            if (url.includes('/product/')) {
                return Promise.resolve({
                    ok: true,
                    json: () =>
                        Promise.resolve({
                            productName: 'Camera',
                            productType: 'Electronics',
                            photo: ['https://example.com/camera.jpg'],
                            locationName: 'Hyderabad',
                            price: 100,
                        }),
                });
            } else if (url.includes('/booking')) {
                return Promise.resolve({
                    ok: false,
                    json: () => Promise.resolve({ message: 'Booking Failed' }),
                });
            }
            return Promise.reject('Unknown API');
        });

        renderComponent();

        const payNowBtn = await screen.findByText(/Pay Now/i);
        fireEvent.click(payNowBtn);

        await waitFor(() => {
            expect(screen.getByText(/Booking Failed/i)).toBeInTheDocument();
        });
    });

    test('4. Redirects to login if user is not logged in', async () => {
        document.cookie = ''; // Clear cookie
        setupFetchSuccess();

        renderComponent();

        await waitFor(() => {
            expect(mockedNavigate).toHaveBeenCalledWith('/login');
        });
    });
});
