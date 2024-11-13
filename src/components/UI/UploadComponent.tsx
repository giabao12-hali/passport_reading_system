// import axios from 'axios';

// const uploadFiles = async (files, bookingId) => {
//     const formData = new FormData();
//     files.forEach(file => {
//         formData.append('images', file);
//     });
//     formData.append('bookingId', bookingId);

//     try {
//         const response = await axios.post('http://localhost:5000/api/upload', formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             },
//         });

//         if (response.status === 200) {
//             const { ocrResult, bookingResult } = response.data;
//             console.log("OCR Result:", ocrResult);
//             console.log("Booking Result:", bookingResult);

//             // Hiển thị OCR và Booking trên UI
//             // Ví dụ: gán dữ liệu vào state để hiển thị
//             setOcrData(JSON.parse(ocrResult));
//             setBookingData(JSON.parse(bookingResult));
//         }
//     } catch (error) {
//         console.error("Error:", error);
//         alert("Có lỗi xảy ra!");
//     }
// };
// export default uploadFiles;