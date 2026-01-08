// eslint-disable-next-line no-unused-vars
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Calendar } from "lucide-react";
import PropTypes from "prop-types";

// eslint-disable-next-line react/prop-types
const EventsList = ({ searchQuery = "", filterByCreator = false }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localSearch, setLocalSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showPast, setShowPast] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(12);
  const [interested, setInterested] = useState({});
  const [details, setDetails] = useState(null);

  const userRole = typeof window !== "undefined" ? localStorage.getItem("userRole") : null;
  const currentUserId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const isAlumni = userRole === "alumni";

  const fetchEvents = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await axios.get("http://localhost:8083/api/events");
      const data = response?.data;
      const list = Array.isArray(data) ? data : Array.isArray(data?.events) ? data.events : [];
      setEvents(list);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Error fetching events. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const categories = useMemo(() => {
    const set = new Set();
    (events || []).forEach((e) => {
      if (e?.category) set.add(e.category);
    });
    return ["All", ...Array.from(set).sort()];
  }, [events]);

  const [debouncedLocalSearch, setDebouncedLocalSearch] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedLocalSearch(localSearch), 300);
    return () => clearTimeout(t);
  }, [localSearch]);

  const effectiveQuery = (searchQuery || debouncedLocalSearch || "").toLowerCase();

  const { upcoming, past } = useMemo(() => {
    const now = new Date();
    const filtered = (events || []).filter((e) => {
      const desc = (e?.description || "").toLowerCase();
      const cat = (e?.category || "").toLowerCase();
      const matchesQuery = !effectiveQuery || desc.includes(effectiveQuery) || cat.includes(effectiveQuery);
      const matchesCategory = selectedCategory === "All" || e?.category === selectedCategory;
      const matchesCreator = !filterByCreator || (currentUserId && String(e?.createdBy?._id || e?.createdBy) === String(currentUserId));
      return matchesQuery && matchesCategory && matchesCreator;
    });

    const withDates = filtered.map((e) => ({ ...e, _date: e?.dateTime ? new Date(e.dateTime) : null }));
    const upcomingList = withDates
      .filter((e) => e._date && e._date >= now)
      .sort((a, b) => a._date - b._date);
    const pastList = withDates
      .filter((e) => !e._date || e._date < now)
      .sort((a, b) => (b._date?.getTime?.() || 0) - (a._date?.getTime?.() || 0));
    return { upcoming: upcomingList, past: pastList };
  }, [events, effectiveQuery, selectedCategory, filterByCreator, currentUserId]);

  const formatBadgeDate = (d) => {
    if (!d) return "TBD";
    const date = new Date(d);
    return date
      .toLocaleString(undefined, {
        month: "short",
        day: "2-digit",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .replace(",", " •");
  };

  const makeGoogleCalendarUrl = (e) => {
    const start = e?.dateTime ? new Date(e.dateTime) : null;
    const end = start ? new Date(start.getTime() + 60 * 60 * 1000) : null;
    const fmt = (dt) => (dt ? dt.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z" : "");
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: e?.description || "Event",
      dates: start && end ? `${fmt(start)}/${fmt(end)}` : "",
      details: e?.link || "",
    });
    return `https://www.google.com/calendar/render?${params.toString()}`;
  };

  const makeICS = (e) => {
    const uid = e?._id || Math.random().toString(36).slice(2);
    const start = e?.dateTime ? new Date(e.dateTime) : null;
    const end = start ? new Date(start.getTime() + 60 * 60 * 1000) : null;
    const fmt = (dt) => (dt ? dt.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z" : "");
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Alumni-Connect//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `UID:${uid}`,
      start ? `DTSTART:${fmt(start)}` : "",
      end ? `DTEND:${fmt(end)}` : "",
      `SUMMARY:${(e?.description || "Event").replace(/\n/g, " ")}`,
      e?.link ? `DESCRIPTION:${e.link}` : "",
      "END:VEVENT",
      "END:VCALENDAR",
    ]
      .filter(Boolean)
      .join("\n");
    return `data:text/calendar;charset=utf8,${encodeURIComponent(ics)}`;
  };

  const handleShare = async (e) => {
    const url = e?.link || window.location.href;
    const text = e?.description || "Check this event";
    try {
      if (navigator.share) {
        await navigator.share({ title: "Event", text, url });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard");
      } else {
        alert(url);
      }
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  const toggleInterested = async (eventId) => {
    const target = events.find((e) => e._id === eventId);
    if (target?.isClosed) {
      alert("This event is closed.");
      return;
    }

    if (!currentUserId) {
      alert("Please log in to mark interest");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8083/api/events/${eventId}/interested`,
        { userId: currentUserId }
      );

      if (response.data.success) {
        setInterested((prev) => ({
          ...prev,
          [eventId]: response.data.isInterested,
        }));

        setEvents((prevEvents) =>
          prevEvents.map((evt) =>
            evt._id === eventId
              ? {
                  ...evt,
                  interestedUsers: response.data.isInterested
                    ? [...(evt.interestedUsers || []), currentUserId]
                    : (evt.interestedUsers || []).filter((id) => id !== currentUserId),
                  interestedCount: response.data.interestedCount,
                }
              : evt
          )
        );
      }
    } catch (err) {
      console.error("Failed to toggle interested:", err);
      alert("Failed to update interest status");
    }
  };

  useEffect(() => {
    if (events && currentUserId) {
      const interestedMap = {};
      events.forEach((evt) => {
        if (evt.interestedUsers && Array.isArray(evt.interestedUsers)) {
          interestedMap[evt._id] = evt.interestedUsers.some(
            (id) => id.toString() === currentUserId.toString()
          );
        }
      });
      setInterested(interestedMap);
    }
  }, [events, currentUserId]);

  const visibleUpcoming = (upcoming || []).slice(0, itemsToShow);
  const hasUpcoming = Array.isArray(upcoming) && upcoming.length > 0;
  const hasPast = Array.isArray(past) && past.length > 0;
  const emptyUpcomingMessage = (searchQuery || localSearch)
    ? `No events found matching "${searchQuery || localSearch}"`
    : "No events available at the moment.";

  const noUpcomingContent = (
    <div className="text-center py-8">
      <p className="text-gray-500 dark:text-slate-400 text-lg">{emptyUpcomingMessage}</p>
      {!searchQuery && !localSearch && isAlumni ? (
        <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">Go to Dashboard → Cards → &quot;Schedule an Event&quot;</p>
      ) : null}
    </div>
  );

  useEffect(() => {
    if (!loading && !error && !hasUpcoming && hasPast) {
      setShowPast(true);
    }
  }, [loading, error, hasUpcoming, hasPast]);

  const closeDetails = () => setDetails(null);

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to close this event?")) return;

    try {
      await axios.delete(`http://localhost:8083/api/events/${eventId}`, {
        data: { userId: currentUserId, userRole },
      });
      fetchEvents();
      closeDetails();
      alert("Event closed successfully");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to close event");
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-lg shadow-lg mx-4 my-2 max-w-full">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-40 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
          <div className="h-6 w-16 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 dark:bg-slate-800">
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-slate-700 rounded mb-3 animate-pulse" />
              <div className="h-3 w-1/2 bg-gray-200 dark:bg-slate-700 rounded mb-2 animate-pulse" />
              <div className="h-3 w-1/3 bg-gray-200 dark:bg-slate-700 rounded mb-4 animate-pulse" />
              <div className="h-9 w-full bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow mx-4 my-2 text-center max-w-full">
        <p className="text-red-600 dark:text-red-400 mb-3">{error}</p>
        <button onClick={fetchEvents} className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded hover:opacity-90">
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-lg shadow-lg mx-4 my-2 overflow-hidden w-auto max-w-full box-border">
        <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6 w-full">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Events</h2>
            <span className="bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap">
              {upcoming.length + past.length} total
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setItemsToShow(12);
                }}
                className={`px-3 py-1.5 rounded-full border text-sm transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-transparent"
                    : "bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
                }`}
                aria-pressed={selectedCategory === cat}
              >
                {cat}
              </button>
            ))}
            <div className="w-full sm:w-auto sm:ml-auto relative mt-2 sm:mt-0">
              <input
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search events..."
                className="w-full pl-3 pr-3 py-1.5 border border-gray-300 dark:border-slate-600 rounded-full text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                aria-label="Search events"
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming</h3>
            <span className="text-sm text-gray-600 dark:text-slate-400">{upcoming.length} events</span>
          </div>
          {visibleUpcoming.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {visibleUpcoming.map((event) => {
                const isClosed = !!event?.isClosed;
                return (
                  <div
                    key={event._id}
                    className={`border border-gray-300 dark:border-slate-700 rounded-lg p-3 sm:p-4 hover:shadow-lg transition-shadow bg-gradient-to-br ${
                      isClosed ? "from-gray-100 to-gray-50 dark:from-slate-800 dark:to-slate-700 opacity-60" : "from-white to-blue-50 dark:from-slate-800 dark:to-slate-900"
                    }`}
                  >
                    {isClosed && (
                      <div className="mb-2 inline-block bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                        CLOSED
                      </div>
                    )}
                    {event?.createdBy && (
                      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200 dark:border-slate-700">
                        <img
                          src={event.createdBy.profilePhoto || "https://via.placeholder.com/32?text=A"}
                          alt={event.createdBy.fullName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-white truncate">{event.createdBy.fullName}</p>
                          <p className="text-[10px] text-gray-600 dark:text-slate-400">Batch {event.createdBy.graduationYear}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white flex-1 line-clamp-2">
                        {event?.title || event?.description || "Untitled Event"}
                      </h3>
                      <div className="flex flex-col items-end gap-1">
                        <span className="bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap flex-shrink-0">
                          {event?.category || "General"}
                        </span>
                        {event?.createdBy && currentUserId && String(event.createdBy._id || event.createdBy) === String(currentUserId) && (
                          <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-[10px] font-semibold whitespace-nowrap flex-shrink-0">
                            Organizer
                          </span>
                        )}
                        <span className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
                          {formatBadgeDate(event?.dateTime)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-3 sm:mb-4">
                      <div className="flex items-center text-gray-600 dark:text-slate-400 text-xs sm:text-sm">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">
                          {event?.dateTime ? new Date(event.dateTime).toLocaleString() : "Date/Time TBD"}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {isClosed ? (
                        <div className="inline-block text-center bg-gray-200 text-gray-500 py-2 sm:py-2.5 rounded font-semibold text-sm sm:text-base">
                          Closed
                        </div>
                      ) : (
                        <a
                          href={event?.link || "#"}
                          className="inline-block text-center bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-2 sm:py-2.5 rounded hover:opacity-90 transition font-semibold text-sm sm:text-base"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Join event"
                        >
                          Join
                        </a>
                      )}
                      {isAlumni ? (
                        <div className="py-2 sm:py-2.5 rounded border border-cyan-300 dark:border-cyan-700 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 font-semibold text-sm sm:text-base text-center">
                          {(event?.interestedUsers?.length || event?.interestedCount || 0)} Interested
                        </div>
                      ) : (
                        <button
                          onClick={() => !isClosed && toggleInterested(event._id)}
                          disabled={isClosed}
                          className={`py-2 sm:py-2.5 rounded border font-semibold text-sm sm:text-base ${
                            isClosed
                              ? "border-gray-200 dark:border-slate-700 text-gray-400 dark:text-slate-500 bg-gray-100 dark:bg-slate-800 cursor-not-allowed"
                              : interested[event._id]
                                ? "border-green-600 dark:border-green-500 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30"
                                : "border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700"
                          }`}
                          aria-pressed={!!interested[event._id]}
                        >
                          {isClosed ? "Closed" : interested[event._id] ? "Interested ✓" : "Mark Interested"}
                        </button>
                      )}
                      <button
                        onClick={() => setDetails(event)}
                        className="col-span-2 text-center py-2 rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700 text-sm"
                        aria-label="View details"
                      >
                        Details
                      </button>
                      {event?.createdBy && currentUserId && (String(event.createdBy._id || event.createdBy) === String(currentUserId) || userRole === "admin") && (
                        <button
                          onClick={() => handleDeleteEvent(event._id)}
                          className="col-span-2 text-center py-2 rounded border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 text-sm font-semibold transition"
                          aria-label="Close event"
                        >
                          Close Event
                        </button>
                      )}
                      <a
                        href={makeGoogleCalendarUrl(event)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="col-span-2 text-center py-2 rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700 text-sm"
                        aria-label="Add to Google Calendar"
                      >
                        Add to Google Calendar
                      </a>
                      <a
                        href={makeICS(event)}
                        download={`event-${event._id || "invite"}.ics`}
                        className="col-span-2 text-center py-2 rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700 text-sm"
                        aria-label="Download ICS"
                      >
                        Download .ics
                      </a>
                      <button
                        onClick={() => handleShare(event)}
                        className="col-span-2 text-center py-2 rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700 text-sm"
                        aria-label="Share event"
                      >
                        Share
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            noUpcomingContent
          )}
          {upcoming.length > itemsToShow && (
            <div className="text-center mt-4">
              <button
                onClick={() => setItemsToShow((n) => n + 12)}
                className="px-4 py-2 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white rounded hover:bg-gray-200 dark:hover:bg-slate-700 text-sm"
              >
                Load more
              </button>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Past Events</h3>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-slate-400">{Array.isArray(past) ? past.length : 0} events</span>
              <button
                type="button"
                onClick={() => hasPast && setShowPast((v) => !v)}
                disabled={!hasPast}
                className={`px-3 py-1.5 text-sm border rounded ${
                  !hasPast ? "border-gray-200 dark:border-slate-700 text-gray-400 dark:text-slate-500 cursor-not-allowed" : "border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700"
                }`}
                aria-expanded={showPast}
                aria-controls="past-list"
              >
                {showPast ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {!hasPast && <div className="text-sm text-gray-500 dark:text-slate-400 mb-2">No past events.</div>}
          {showPast && hasPast && (
            <div
              id="past-list"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
            >
              {(past || []).map((event) => (
                <div key={event._id} className="border border-gray-200 dark:border-slate-700 rounded-lg p-3 sm:p-4 bg-gray-50 dark:bg-slate-800 opacity-90">
                  {event?.createdBy && (
                    <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-300 dark:border-slate-700">
                      <img
                        src={event.createdBy.profilePhoto || "https://via.placeholder.com/32?text=A"}
                        alt={event.createdBy.fullName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-white truncate">{event.createdBy.fullName}</p>
                        <p className="text-[10px] text-gray-600 dark:text-slate-400">Batch {event.createdBy.graduationYear}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-slate-300 flex-1 line-clamp-2">
                      {event?.title || event?.description || "Untitled Event"}
                    </h3>
                    <div className="flex flex-col items-end gap-1">
                      <span className="bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-slate-300 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap flex-shrink-0">
                        {event?.category || "General"}
                      </span>
                      <span className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
                        {formatBadgeDate(event?.dateTime)}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-slate-400 mb-3">Event ended</div>
                  <div className="grid grid-cols-2 gap-2">
                    {isAlumni ? (
                      <div className="col-span-2 py-2 rounded border border-cyan-300 dark:border-cyan-700 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 font-semibold text-sm text-center">
                        {(event?.interestedUsers?.length || event?.interestedCount || 0)} Interested
                      </div>
                    ) : (
                      <>
                        <div className="py-2 rounded bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-400 text-center text-sm font-semibold">Join (Closed)</div>
                        <div className="py-2 rounded bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-400 text-center text-sm">
                          {(event?.interestedUsers?.length || event?.interestedCount || 0)} Interested
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {details && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-40" onClick={closeDetails} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-between">
                <h4 className="text-lg font-semibold text-white">Event Details</h4>
                <button onClick={closeDetails} className="px-3 py-1.5 rounded hover:bg-white/20 text-sm text-white">
                  Close
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  {details?.createdBy && (
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200 dark:border-slate-700">
                      <img
                        src={details.createdBy.profilePhoto || "https://via.placeholder.com/48?text=A"}
                        alt={details.createdBy.fullName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">{details.createdBy.fullName}</p>
                        <p className="text-xs text-gray-600 dark:text-slate-400 mb-1">Batch {details.createdBy.graduationYear}</p>
                        {details.createdBy.course && <p className="text-xs text-gray-600 dark:text-slate-400">{details.createdBy.course}</p>}
                        {details.createdBy.fieldOfStudy && <p className="text-xs text-gray-600 dark:text-slate-400">{details.createdBy.fieldOfStudy}</p>}
                      </div>
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white flex-1">
                      {details?.title || details?.description || "Untitled Event"}
                    </h5>
                    <div className="flex flex-col items-end gap-1">
                      <span className="bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap flex-shrink-0">
                        {details?.category || "General"}
                      </span>
                      {details?.createdBy && currentUserId && String(details.createdBy._id || details.createdBy) === String(currentUserId) && (
                        <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-[10px] font-semibold whitespace-nowrap">Organizer</span>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-600 dark:text-slate-400 flex items-center gap-2">
                    <span className="inline-block px-2 py-1 rounded bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300">{formatBadgeDate(details?.dateTime)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {details?.isClosed ? (
                    <div className="col-span-2 text-center bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-400 py-2 rounded font-semibold">Closed</div>
                  ) : (
                    <a
                      href={details?.link || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="col-span-2 text-center bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-2 rounded hover:opacity-90 font-semibold"
                    >
                      Register / Join
                    </a>
                  )}
                  {details?.createdBy && currentUserId && (String(details.createdBy._id || details.createdBy) === String(currentUserId) || userRole === "admin") && (
                    <button
                      onClick={() => {
                        handleDeleteEvent(details._id);
                      }}
                      className="col-span-2 text-center py-2 rounded border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 font-semibold transition"
                    >
                      Close Event
                    </button>
                  )}
                  <a
                    href={makeGoogleCalendarUrl(details)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="col-span-2 text-center py-2 rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700 text-sm"
                  >
                    Add to Google Calendar
                  </a>
                  <a
                    href={makeICS(details)}
                    download={`event-${details?._id || "invite"}.ics`}
                    className="col-span-2 text-center py-2 rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700 text-sm"
                  >
                    Download .ics
                  </a>
                  <button onClick={() => handleShare(details)} className="col-span-2 text-center py-2 rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700 text-sm">
                    Share
                  </button>
                  {details?.link && (
                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(details.link);
                          alert("Registration link copied");
                        } catch {
                          alert(details.link);
                        }
                      }}
                      className="col-span-2 text-center py-2 rounded border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700 text-sm"
                    >
                      Copy Registration Link
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

EventsList.propTypes = {
  searchQuery: PropTypes.string,
};

export default EventsList;
