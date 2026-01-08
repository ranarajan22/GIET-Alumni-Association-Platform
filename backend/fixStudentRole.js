const mongoose = require('mongoose');
const User = require('./Models/users');

const fixStudentRoles = async () => {
    try {
        await mongoose.connect('mongodb+srv://mongodbuser:mongo12345@cluster0.ko5aq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
        console.log('Connected to MongoDB');

        // Find all users that don't have a role set or have undefined role
        const usersWithoutRole = await User.find({
            $or: [
                { role: { $exists: false } },
                { role: null },
                { role: undefined }
            ]
        });

        console.log(`Found ${usersWithoutRole.length} users without role`);

        // Update them to have role: 'student'
        if (usersWithoutRole.length > 0) {
            const result = await User.updateMany(
                {
                    $or: [
                        { role: { $exists: false } },
                        { role: null },
                        { role: undefined }
                    ]
                },
                { $set: { role: 'student' } }
            );
            console.log(`Updated ${result.modifiedCount} users with role: 'student'`);
        }

        // Verify the update
        const students = await User.countDocuments({ role: 'student' });
        const alumni = await User.countDocuments({ role: 'alumni' });
        const admins = await User.countDocuments({ role: 'admin' });

        console.log('\n=== Final Count ===');
        console.log(`Students: ${students}`);
        console.log(`Alumni: ${alumni}`);
        console.log(`Admins: ${admins}`);
        console.log(`Total: ${students + alumni + admins}`);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

fixStudentRoles();
