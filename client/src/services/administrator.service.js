import http from "../http-common.ts";

class AdministratorService {
  getAll() {
    return http.get("/gestionareconturi");
  }

  get(id) {
    return http.get(`/gestionareconturi/${id}`);
  }

  create(data) {
    return http.post("/gestionareconturi", data);
  }

  update(id, data) {
    return http.put(`/gestionareconturi/${id}`, data);
  }

  delete(id) {
    return http.delete(`/gestionareconturi/${id}`);
  }

  deleteAll() {
    return http.delete(`/gestionareconturi`);
  }

  findAllByCondition(name) {
    return http.get(`/gestionareconturi?name=${name}`);
  }
}

export default new AdministratorService();