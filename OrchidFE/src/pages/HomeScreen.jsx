import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/esm/Container';
import { toast } from 'react-toastify';
import { Spinner, Alert, Pagination } from 'react-bootstrap';
import OrchidList from '../components/OrchidList';
import { orchidAPI } from '../services/userService';

export default function HomeScreen() {
    const [orchids, setOrchids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 0,
        totalPages: 0,
        totalElements: 0,
        pageSize: 12
    });

    useEffect(() => {
        fetchOrchids();
    }, [pagination.currentPage]);

    const fetchOrchids = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await orchidAPI.getOrchids({
                page: pagination.currentPage,
                size: pagination.pageSize,
                sortBy: 'createAt',
                sortDirection: 'desc'
            });

            if (response.code === 200 && response.payload) {
                setOrchids(response.payload.content || []);
                setPagination(prev => ({
                    ...prev,
                    totalPages: response.payload.totalPages,
                    totalElements: response.payload.totalElements
                }));
            } else {
                setError('Không thể tải danh sách hoa lan');
            }
        } catch (error) {
            console.error('Error fetching orchids:', error);
            setError('Có lỗi xảy ra khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (pageNumber) => {
        setPagination(prev => ({
            ...prev,
            currentPage: pageNumber
        }));
    };

    const handleAddToCart = (item) => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const exists = cart.find(i => i.id === item.id);
        if (!exists) {
            cart.push({ 
                ...item, 
                quantity: 1,
                orchidName: item.name // Map name to orchidName for cart compatibility
            });
            localStorage.setItem('cart', JSON.stringify(cart));
            toast.success(`Đã thêm ${item.name} vào giỏ hàng!`, { duration: 3000 });
        } else {
            toast.info(`${item.name} đã có trong giỏ hàng!`);
        }
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Alert variant="danger" className="mt-4">
                    <Alert.Heading>Có lỗi xảy ra!</Alert.Heading>
                    <p>{error}</p>
                    <div className="d-flex justify-content-end">
                        <button className="btn btn-outline-danger" onClick={fetchOrchids}>
                            Thử lại
                        </button>
                    </div>
                </Alert>
            </Container>
        );
    }

    return (
        <Container>
            <div className="d-flex justify-content-between align-items-center my-4">
                <h2>Danh sách hoa lan</h2>
                <span className="text-muted">
                    Tổng cộng: {pagination.totalElements} sản phẩm
                </span>
            </div>
            
            <OrchidList orchids={orchids} onAddToCart={handleAddToCart} />
            
            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                    <Pagination>
                        <Pagination.First 
                            onClick={() => handlePageChange(0)}
                            disabled={pagination.currentPage === 0}
                        />
                        <Pagination.Prev 
                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 0}
                        />
                        
                        {[...Array(pagination.totalPages)].map((_, index) => (
                            <Pagination.Item
                                key={index}
                                active={index === pagination.currentPage}
                                onClick={() => handlePageChange(index)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        
                        <Pagination.Next 
                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                            disabled={pagination.currentPage === pagination.totalPages - 1}
                        />
                        <Pagination.Last 
                            onClick={() => handlePageChange(pagination.totalPages - 1)}
                            disabled={pagination.currentPage === pagination.totalPages - 1}
                        />
                    </Pagination>
                </div>
            )}
        </Container>
    )
}