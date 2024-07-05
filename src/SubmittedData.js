import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, getKeyValue } from "@nextui-org/react";
import { Link } from 'react-router-dom';
import { BsArrowLeft } from "react-icons/bs";

const SubmittedData = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const rowsPerPage = 8;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://mern-form-validation.onrender.com/getdata');
                console.log(response.data);
                const formattedData = response.data.map(item => ({
                    ...item,
                    dateOfInvoice: formatDate(item.dateOfInvoice)
                }));
                setData(formattedData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-IN', options);
    };

    const pages = Math.ceil(data.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return data.slice(start, end);
    }, [page, data]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='flex justify-center my-5'>
            <div className='submited_data'>
                <h1>List Of Products</h1>
                <Table
                    aria-label="Example table with client side pagination"
                    bottomContent={
                        <div className="flex w-full justify-center">
                            <Pagination
                                isCompact
                                showControls
                                showShadow
                                color="secondary"
                                page={page}
                                total={pages}
                                onChange={(page) => setPage(page)}
                            />
                        </div>
                    }
                    classNames={{
                        wrapper: "min-h-[222px]",
                    }}
                >
                    <TableHeader>
                        <TableColumn key="category">CATEGORY</TableColumn>
                        <TableColumn key="model">MODEL</TableColumn>
                        <TableColumn key="sNumber">SERIAL NUMBER</TableColumn>
                        <TableColumn key="dateOfInvoice">DATE OF INVOICE</TableColumn>
                    </TableHeader>
                    <TableBody items={items}>
                        {(item) => (
                            <TableRow key={item.sNumber}>
                                {(columnKey) => (
                                    <TableCell>
                                        {columnKey === 'dateOfInvoice' ? formatDate(item[columnKey]) : getKeyValue(item, columnKey)}
                                    </TableCell>
                                )}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <Link to="/">
                    <button className='back_button'><BsArrowLeft className='mr-2' />Back to Form</button>
                </Link>
            </div>
        </div>
    );
};

export default SubmittedData;
