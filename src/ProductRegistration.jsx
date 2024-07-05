import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import './App.css';
import { BsArrowUpRight } from "react-icons/bs";


const ProductRegistrationForm = () => {
    const [formData, setFormData] = useState({
        category: '',
        model: '',
        sNumber: '',
        dateOfInvoice: ''
    });
    const [files, setFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        if (validateFiles(droppedFiles)) {
            setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
            setErrors((prevErrors) => ({ ...prevErrors, files: '' }));
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (validateFiles(selectedFiles)) {
            setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
            setErrors((prevErrors) => ({ ...prevErrors, files: '' }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: value ? '' : prevErrors[name] }));
    };

    const validateForm = () => {
        const newErrors = {};
        const serialNumberRegex = /^[a-zA-Z0-9]*$/;

        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.model) newErrors.model = 'Model is required';
        if (!formData.sNumber) newErrors.sNumber = 'Serial number is required';
        else if (!serialNumberRegex.test(formData.sNumber)) newErrors.sNumber = 'Special Character not allowed';
        if (!formData.dateOfInvoice) newErrors.dateOfInvoice = 'Date of Invoice is required';
        if (files.length === 0) newErrors.files = 'At least one file must be uploaded';
        return newErrors;
    };

    const validateFiles = (files) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));
        if (invalidFiles.length > 0) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                files: 'Only image files (jpg, png, gif) are allowed'
            }));
            return false;
        }
        return true;
    };

    const submitEvent = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});
        setIsSubmitting(true);

        try {
            const response = await axios.post('https://mern-form-validation.onrender.com/register', formData);
            console.log('Form data sent:', formData);
            console.log('Server response:', response.data);
            setFormData({
                category: '',
                model: '',
                sNumber: '',
                dateOfInvoice: ''
            });
            setFiles([]);
            setIsSubmitting(false);

            Swal.fire({
                title: "Product registered",
                text: "Your product has been created!",
                icon: "success",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Ok",
                customClass: {
                    confirmButton: 'swal-button',
                },
                width: '400px',

            });
        } catch (error) {
            console.error('Error sending form data:', error);
        }
    };

    const categories = [
        { value: "", label: "Select Category" },
        { value: "Cookware", label: "Cookware" },
        { value: "Utensils and Gadgets", label: "Utensils and Gadgets" },
        { value: "Storage", label: "Storage" },
        { value: "Dinnerware", label: "Dinnerware" },
        { value: "Cleaning", label: "Cleaning" },
        { value: "Tools", label: "Tools" }
    ];

    return (
        <div className="form-container">
            <div className='form_inner'>
                <div className="form-image">
                    <div className="form-image-content">
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto vel quae consectetur provident.</p>
                    </div>
                </div>
                <div className="form-content">
                    <form className="registration-form" onSubmit={submitEvent}>
                        <h2>Register your product</h2>
                        <div className='form_row'>
                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="input"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                                    ))}
                                </select>
                                {errors.category && <span className="error">{errors.category}</span>}
                            </div>
                            <div className="form-group inputForm">
                                <label>Model </label>
                                <select
                                    name="model"
                                    value={formData.model}
                                    onChange={handleChange}
                                    className="input"
                                >
                                    <option value="">Select Model</option>
                                    <option value="Model 1001">Model 1001</option>
                                    <option value="Model 2002">Model 2002</option>
                                    <option value="Model 3003">Model 3003</option>
                                    <option value="Model 4004">Model 4004</option>
                                </select>
                                {errors.model && <span className="error">{errors.model}</span>}
                            </div>
                        </div>
                        <div className='form_row'>
                            <div className="form-group">
                                <label>Serial number <span>*</span></label>
                                <input
                                    type="text"
                                    name="sNumber"
                                    value={formData.sNumber}
                                    onChange={handleChange}
                                    className="input"
                                />
                                {errors.sNumber && <span className="error">{errors.sNumber}</span>}
                            </div>
                            <div className="form-group">
                                <label>Date of Invoice</label>
                                <input
                                    type="date"
                                    name="dateOfInvoice"
                                    value={formData.dateOfInvoice}
                                    onChange={handleChange}
                                    className="input"
                                />
                                {errors.dateOfInvoice && <span className="error">{errors.dateOfInvoice}</span>}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Upload File</label>
                            <label
                                className="file-upload"
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                htmlFor="file-input"
                            >
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                    id="file-input"
                                    className="input"

                                />
                                <p>Drag files here or <span>browse</span></p>
                            </label>
                            {errors.files && <span className="error">{errors.files}</span>}
                        </div>
                        <button className='button' type="submit" disabled={isSubmitting}>Submit</button>
                    </form>
                    <div className="file-list">
                        {files.length > 0 && <h3>Uploaded Files:</h3>}
                        <ul>
                            {files.map((file, index) => (
                                <li key={index}>{file.name}</li>
                            ))}
                        </ul>
                    </div>
                    <Link to="/submitted-data">
                        <button className='view_button'>View Submitted Data<BsArrowUpRight className='ml-2' /></button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductRegistrationForm;
