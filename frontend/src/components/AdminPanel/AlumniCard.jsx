// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from 'prop-types';

function AlumniCard({ alumni, onVerify }) {
    return (
        <div className="border p-4 rounded-md shadow-md bg-white">
            <h3 className="text-lg font-bold">{alumni.name}</h3>
            <p>Email: {alumni.email}</p>

            {/* Link to Degree Certificate */}
            <a
                href={alumni.degreeCertificateUrl} // This should be the URL for the certificate
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline mt-2 block"
            >
                View Degree Certificate
            </a>

            {alumni.verified ? (
                <p className="text-green-600 font-semibold">Verified</p>
            ) : (
                <button
                    className="bg-primary text-white px-4 py-2 rounded-md mt-2"
                    onClick={() => onVerify(alumni.id)} // Call onVerify on button click
                >
                    Verify
                </button>
            )}
        </div>
    );
}
AlumniCard.propTypes = {
    alumni: PropTypes.shape({
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        degreeCertificateUrl: PropTypes.string.isRequired,
        verified: PropTypes.bool.isRequired,
        id: PropTypes.string.isRequired,
    }).isRequired,
    onVerify: PropTypes.func.isRequired,
};

export default AlumniCard;
// export default AlumniCard;
