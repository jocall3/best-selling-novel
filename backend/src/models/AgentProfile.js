const mongoose = require('mongoose');

const AgentProfileSchema = new mongoose.Schema({
    // Unique identifier for the agent (e.g., AGT-001)
    designation: {
        type: String,
        required: [true, 'Agent designation is required'],
        unique: true,
        trim: true,
        match: [/^[A-Z]{3}-\d{3}$/, 'Designation must be in the format XXX-000']
    },

    // Human-readable name or codename
    name: {
        type: String,
        required: [true, 'Agent name is required'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },

    // Core personality description
    personality: {
        type: String,
        required: [true, 'Personality description is required'],
        maxlength: [500, 'Personality description cannot exceed 500 characters']
    },

    // Array of key personality traits (e.g., 'Stoic', 'Sarcastic', 'Empathetic')
    traits: {
        type: [String],
        default: [],
        validate: {
            validator: function(v) {
                return v.length <= 10;
            },
            message: props => `Traits array cannot exceed 10 items (got ${props.value.length})`
        }
    },

    // Special abilities or domains of expertise (e.g., 'Quantum Physics', 'Social Engineering')
    abilities: {
        type: [String],
        default: []
    },

    // Performance metrics, stored as key-value pairs (e.g., 'argumentativeFlair': 0.95)
    metrics: {
        type: Map,
        of: {
            type: Number,
            min: [0, 'Metric value must be non-negative'],
            max: [1, 'Metric value must be less than or equal to 1']
        },
        default: {
            // Example default metrics
            efficiency: 0.5,
            reliability: 0.5,
            argumentativeFlair: 0.5
        }
    },

    // Status (e.g., 'Active', 'Maintenance', 'Retired')
    status: {
        type: String,
        enum: ['Active', 'Maintenance', 'Retired', 'Testing'],
        default: 'Active'
    },

    // Date the agent profile was created
    createdAt: {
        type: Date,
        default: Date.now
    },

    // Last time the profile or metrics were updated
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

// Middleware to update the lastUpdated field on save
AgentProfileSchema.pre('save', function(next) {
    this.lastUpdated = Date.now();
    next();
});

// Static method to find agents by a specific trait
AgentProfileSchema.statics.findByTrait = function(trait) {
    return this.find({ traits: trait });
};

// Instance method to check if the agent has a specific ability
AgentProfileSchema.methods.hasAbility = function(ability) {
    return this.abilities.includes(ability);
};

module.exports = mongoose.model('AgentProfile', AgentProfileSchema);