import axios from "axios";
import React, { useEffect, useState } from "react";
import server from "../../../server";
import ClipLoader from "react-spinners/ClipLoader";
import UserEventMainCard from "../../../components/events/UserEventMainCard";
import { useSelector } from "react-redux";

const EventsPage = ({ onHomePage }) => {
    const [loading, setLoading] = useState(false);
    const [events, setEvents] = useState([]);
    const userData = useSelector((state) => state.userData.userData);
    const [arrayDataLow, setArrayDataLow] = useState(false);
    useEffect(() => {
        setLoading(true);
        let plusMember = false;
        try {
            if (userData.plusMember) plusMember = true;
        } catch (err) {
            plusMember = false;
        }
        axios
            .get(`${server}/event/all-events?plusMember=${plusMember}`)
            .then((res) => {
                if (res.data?.eventsData?.length > 1) setArrayDataLow(true);
                setEvents(res.data?.eventsData);
            })
            .catch((err) => console.log(err))
            .finally(() => {
                setLoading(false);
            });
    }, []);
    return (
        <main className="vw-100 mt-4">
            {loading && (
                <div className="d-flex justify-content-center ">
                    <ClipLoader
                        className="text-primary mx-auto mt-5 "
                        loading={loading}
                        size={30}
                        color="primary"
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                </div>
            )}

            <div className="w-100 container container-xxl ">
                {onHomePage && arrayDataLow ? (
                    <div
                        id="carouselExample"
                        className="carousel slide"
                        data-bs-ride="carousel"
                    >
                        <div
                            style={{ aspectRatio: "24/9" }}
                            className="carousel-inner"
                        >
                            {events.map((event, i) => (
                                <div
                                    key={event._id}
                                    className={`carousel-item ${
                                        i === 1 ? "active" : null
                                    }`}
                                >
                                    <UserEventMainCard
                                        key={event._id}
                                        event={event}
                                    />
                                </div>
                            ))}
                        </div>
                        <button
                            className="carousel-control-prev z-3 h-25 mt-auto w-50"
                            type="button"
                            data-bs-target="#carouselExample"
                            data-bs-slide="prev"
                        >
                            <span
                                className="carousel-control-prev-icon rounded-5 ms-auto mt-auto m-3"
                                aria-hidden="true"
                            ></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button
                            className="carousel-control-next h-25 mt-auto w-50"
                            type="button"
                            data-bs-target="#carouselExample"
                            data-bs-slide="next"
                        >
                            <span
                                className="carousel-control-next-icon rounded-5 me-auto mt-auto m-3"
                                aria-hidden="true"
                            ></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                ) : (
                    <>
                        {events.map((event) => (
                            <UserEventMainCard key={event._id} event={event} />
                        ))}
                    </>
                )}
            </div>
        </main>
    );
};

EventsPage.defaultProps = {
    onHomePage: false,
};

export default EventsPage;
