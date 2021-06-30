import http from "../http-common.ts";

class VoteSessionsService {
  getAll() {
    return http.get("/sesiunivot/toatesesiunile");
  }

  get(id, accessCode) {
    return http.get(
      `/sesiunivot/${id}/${accessCode}/` +
        JSON.parse(window.localStorage.getItem("user")).accessToken
    );
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
    return http.get(`/sesiunivot/toatesesiunile?name=${title}`);
  }
}

export default new VoteSessionsService();
