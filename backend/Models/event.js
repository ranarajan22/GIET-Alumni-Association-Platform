const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    // Core
    title: { type: String },
    description: { type: String, required: true },
    category: { type: String, required: true },

    // Timing
    dateTime: { type: Date, required: true },
    endDateTime: { type: Date },

    // Access & location
    mode: { type: String, enum: ["online", "offline", "hybrid"], default: "online" },
    venue: { type: String },
    locationLink: { type: String },

    // Registration & capacity
    registrationRequired: { type: Boolean, default: false },
    link: { type: String },
    capacity: { type: Number },

    // Presentation
    bannerUrl: { type: String },
    tags: [{ type: String }],

    // Ownership
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Alumni' },
    organizerName: { type: String },
    organizerContact: { type: String },

    // Engagement
    interestedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Status
    isClosed: { type: Boolean, default: false },
    closedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
