const server = import.meta.env.VITE_API_URL;
if (!server) console.log("ENV FILES NOT FOUND");
export default `${server}/api/v1`;
