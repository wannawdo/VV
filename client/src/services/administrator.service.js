import http from "../http-common.ts";
import authHeader from "./auth-header";

class AdministratorService {
  getAll() {
    return http.get("/gestionareconturi", { headers: authHeader() });
  }

  get(id) {
    return http.get(`/gestionareconturi/${id}`, { headers: authHeader() });
  }

  activate(id) {
    return http.post(`/gestionareconturi/activare/${id}`, {
      accessToken: JSON.parse(window.localStorage.getItem("user")).accessToken,
    });
  }

  activateAll() {
    return http.post(`/gestionareconturi/activareConturi/`, {
      accessToken: JSON.parse(window.localStorage.getItem("user")).accessToken,
    });
  }

  create(data) {
    return http.post("/gestionareconturi", data);
  }

  update(id, data) {
    return http.put(
      `/gestionareconturi/${id}`,
      { headers: authHeader() },
      data
    );
  }

  delete(id) {
    return http.delete(`/gestionareconturi/${id}`, { headers: authHeader() });
  }

  deleteAll() {
    return http.delete(`/gestionareconturi`, { headers: authHeader() });
  }

  findAllByCondition(name) {
    return http.get(`/gestionareconturi?name=${name}`, {
      headers: authHeader(),
    });
  }
}

export default new AdministratorService();
