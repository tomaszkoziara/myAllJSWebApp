import angular from "angular";

class VersionService {
    static $inject = ["APIService"]

    constructor(APIService) {
        this.APIService = APIService;
    }

    getLastVersion(id) {
        return this.APIService.get("/api/lots/" + id + "/versions/last");
    }

    updateMeasures(lotId, versionId, measuresArray) {
        return this.APIService.put("/api/lots/" + lotId + "/versions/" + versionId + "/measures", measuresArray);
    }

    getVersion(lotId, versionId) {
        return this.APIService.get("/api/lots/" + lotId + "/versions/" + versionId);
    }

    getVersions(lotId) {
        return this.APIService.get("/api/lots/" + lotId + "/versions");
    }

    createNewVersion(lotId, modifiers) {
        return this.APIService.post("/api/lots/" + lotId + "/versions", modifiers);
    }

}


export default VersionService;