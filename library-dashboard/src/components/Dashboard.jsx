import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = () => {
    const [issuances, setIssuances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [issuancesResponse, membersResponse, booksResponse] = await Promise.all([
                    axios.get("http://localhost:5000/issuances", {
                        headers: {
                            "x-api-key": "mysecureapikey987654",
                        },
                    }),
                    
                    axios.get("http://localhost:5000/members", {
                        headers: {
                            "x-api-key": "mysecureapikey987654",
                        },
                    }),
                    axios.get("http://localhost:5000/books", {
                        headers: {
                            "x-api-key": "mysecureapikey987654",
                        },
                    }),
                ]);

                const pendingIssuances = issuancesResponse.data.filter(
                    (issuance) => !issuance.returned_date
                );

                const membersMap = new Map(membersResponse.data.map((member) => [member.member_id, member]));
                const booksMap = new Map(booksResponse.data.map((book) => [book.book_id, book]));

                const issuancesWithDetails = pendingIssuances.map((issuance) => ({
                    ...issuance,
                    memberName: membersMap.get(issuance.member_id)?.name || "Unknown",
                    bookTitle: booksMap.get(issuance.book_id)?.title || "Unknown",
                }));

                setIssuances(issuancesWithDetails);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p>Loading...</p>
            </div>
        );
    }

    if (error) {
        return <div className="text-center mt-5 text-danger">Error: {error}</div>;
    }

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Pending Book Returns</h1>
            <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th>Member Name</th>
                        <th>Book Title</th>
                        <th>Issued Date</th>
                        <th>Due Date</th>
                    </tr>
                </thead>
                <tbody>
                    {issuances.map((issuance) => (
                        <tr key={issuance.issuance_id}>
                            <td>{issuance.memberName}</td>
                            <td>{issuance.bookTitle}</td>
                            <td>
                                {new Date(issuance.issued_date).toLocaleDateString("en-GB")}
                            </td>
                            <td>
                                {new Date(issuance.due_date).toLocaleDateString("en-GB")}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;