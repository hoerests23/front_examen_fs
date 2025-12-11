import { index, route } from "@react-router/dev/routes";

export default [
   index("routes/login.tsx"),
   route("/admin", "routes/admin.tsx"),
   route("/usuario", "routes/usuario.tsx"),
   route("/home", "routes/home.tsx"),
];
