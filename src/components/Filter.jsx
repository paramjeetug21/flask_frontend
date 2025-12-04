export default filteredProfiles = profiles.filter((profile) => {
  const text = searchTerm.toLowerCase();

  return (
    (profile.personal?.name || "").toLowerCase().includes(text) ||
    (profile.personal?.email || "").toLowerCase().includes(text) ||
    (profile.personal?.phone || "").toLowerCase().includes(text)
  );
});
