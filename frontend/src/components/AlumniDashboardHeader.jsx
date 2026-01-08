import PropTypes from "prop-types";

function AlumniDashboardHeader({ stats, profileData }) {
  // Placeholder component kept for future dashboard header; intentionally returns nothing for now.
  void stats;
  void profileData;
  return null;
}

AlumniDashboardHeader.propTypes = {
  stats: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  profileData: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default AlumniDashboardHeader;
