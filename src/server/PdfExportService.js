import LotService from "./LotService";
import PdfCreator from "./pdf-creator/PdfCreator";
import path from "path";
import moment from "moment";

export default class PdfExportService {

    constructor(lotService) {
        this.lotService = lotService;
        this.pdfCreator = new PdfCreator();
    }

    async getMeasuresPdfStream(lotId, httpContext) {

        const lotResult = await this.lotService.getLot(lotId);
        const lastLotVersionResult = await this.lotService.getLastLotVersion(lotId);

        var context = lotResult.result[0];
        context.i_date = this.formatDate(context.i_date);

        context.measures1 = [];
        context.measures2 = [];
        context.measures3 = [];
        context.measures4 = [];

        for (var i = 0; i < lastLotVersionResult.result.measures.length; i++) {
            var measuresIndex = 1;
            if (i < 25) {
                measuresIndex = 1;
            } else if (i < 50) {
                measuresIndex = 2;
            } else if (i < 75) {
                measuresIndex = 3;
            } else if (i < 100) {
                measuresIndex = 4;
            }

            context["measures" + measuresIndex].push(this.formatMeasure(lastLotVersionResult.result.measures[i]));
        }


        var templatePath = path.resolve(__dirname, "pdf-assets", "measures-template.html");

        return this.pdfCreator.getPdfStream(templatePath, context);

    }

    formatMeasure(measure) {

        if (typeof measure === "number") {
            return measure.toFixed(2);
        }

        return measure;

    }

    formatDate(d) {

        if (d instanceof Date) {
            return moment(d).format("DD/MM/YYYY");
        }

        return d;

    }

}