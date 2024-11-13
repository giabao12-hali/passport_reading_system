import { useState } from "react";
import { Link } from "react-router-dom";

const Index = () => {
    const [bookingId, setBookingId] = useState('');
    return (
        <div className="w-full min-h-screen">
            <div className="flex flex-col items-center gap-6 pt-12">
                <div className="title">
                    <div className="font-bold">
                        <p className="cursor-default underline capitalize">danh sách đoàn du lịch</p>
                    </div>
                </div>
                <div>
                    <input type="text" id="large-input" value={bookingId} onChange={(e) => setBookingId(e.target.value)} className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Điền số Booking ID" />
                </div>
                <Link to={`/passport-read?bookingId=${bookingId}`}
                    target="_blank"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                    Xem danh sách eTour qua Passport
                </Link>
            </div>
        </div>
    );
}

export default Index;