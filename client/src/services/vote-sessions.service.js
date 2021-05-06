import http from "../http-common.ts";

class VoteSessionsService {
  getAll() {
    return http.get("/sesiunivot");
  }

  get(id) {
    return http.get(`/sesiunivot/${id}`);
  }

  create(data) {
    return http.post("/sesiunivot", data);
  }

  update(id, data) {
    return http.put(`/sesiunivot/${id}`, data);
  }

  delete(id) {
    return http.delete(`/sesiunivot/${id}`);
  }

  deleteAll() {
    return http.delete(`/sesiunivot`);
  }

  findByTitle(title) {
    return http.get(`/sesiunivot?nume=${name}`);
  }
}

export default new VoteSessionsService();