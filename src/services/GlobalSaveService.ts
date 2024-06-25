import { HomeScreenInformationData } from "../model";
import { FLOWS_INTERNAL_STORAGE_FILE_NAME, FLOWS_SCREEN_CSV_HEADING, SingleFlowMeasurement, exportMeasurementsAsCSV as getFlowsCSV, restoreStateFromCSV as restoreFlowsDataFromCSV } from "../screens/FlowsScreen";
import { GAS_ANALYSER_CHECK_INTERNAL_STORAGE_FILE_NAME, ANALYSER_SCREEN_CSV_HEADING, GasAnalyzerCheckData, exportMeasurementsAsCSV as getGasCSV, restoreStateFromCSV as restoreGasDataFromCSV } from "../screens/GasAnalyzerCheckScreen";
import { DUST_INTERNAL_STORAGE_FILE_NAME, DUST_SCREEN_CSV_HEADING, DustMeasurement, exportMeasurementsAsCSV as getDustCSV, restoreStateFromCSV as restoreDustDataFromCSV } from "../screens/DustScreen";
import { H2O_INTERNAL_STORAGE_FILE_NAME, H2O_SCREEN_CSV_HEADING, H2OMeasurement, exportMeasurementsAsCSV as geth2oCSV, restoreStateFromCSV as restoreH2ODataFromCSV } from "../screens/H20_14790_Screen";
import { HOME_SCREEN_CSV_HEADING, HOME_SCREEN_INTERNAL_STORAGE_FILE_NAME, PERSONNEL_CSV_HEADING, exportMeasurementsAsCSV as getHomeCSV, exportPersonnelAsCSV, restoreStateFromCSV as restoreHomeDataFromCSV } from "../screens/HomeScreen";
import { UTILITIES_INTERNAL_STORAGE_FILE_NAME, UTILITIES_SCREEN_CSV_HEADING, UtilitiesInternalStorageState, exportMeasurementsAsCSV as getUtilitiesCSV, restoreStateFromCSV as restoreUtilitiesDataFromCSV } from "../screens/UtilitiesScreen";
import FileSystemService from "./FileSystemService";
import { ASPIRATION_INTERNAL_STORAGE_FILE_NAME, ASPIRATION_SCREEN_CSV_HEADING, AspirationMeasurement, exportMeasurementsAsCSV as getAspirationCSV, restoreStateFromCSV as restoreAspirationDataFromCSV } from "../screens/AspirationScreen";

class GlobalSaveService {
    fileSystemService: FileSystemService;

    constructor() {
        this.fileSystemService = new FileSystemService();
    }
    async getGlobalSaveCSVContents(): Promise<string> {
        const flowsData: SingleFlowMeasurement[] = await this.loadScreenData(FLOWS_INTERNAL_STORAGE_FILE_NAME);
        const gasAnalyzerCheckData: GasAnalyzerCheckData = parseDates(await this.loadScreenData(GAS_ANALYSER_CHECK_INTERNAL_STORAGE_FILE_NAME));
        const dustData: DustMeasurement[] = await this.loadScreenData(DUST_INTERNAL_STORAGE_FILE_NAME);
        const h2oData: H2OMeasurement[] = await this.loadScreenData(H2O_INTERNAL_STORAGE_FILE_NAME);
        const utilitiesData: UtilitiesInternalStorageState = await this.loadScreenData(UTILITIES_INTERNAL_STORAGE_FILE_NAME);
        const aspirationData: AspirationMeasurement[] = await this.loadScreenData(ASPIRATION_INTERNAL_STORAGE_FILE_NAME);
        const homeInformation: HomeScreenInformationData = await this.loadScreenData(HOME_SCREEN_INTERNAL_STORAGE_FILE_NAME);

        console.log(utilitiesData)

        // SingleFlowMeasurement[] -> CSV
        // CSV ->  SingleFlowMeasurement[] 
        const homeCSVContents = getHomeCSV(homeInformation)
        const personnelCSVContents = exportPersonnelAsCSV(homeInformation.staffResponsibleForMeasurement);
        const utilitiesCSVContents = getUtilitiesCSV(utilitiesData);
        const flowsCSVContents = getFlowsCSV(flowsData);
        const h2oCSVContents = geth2oCSV(h2oData);
        const dustCSVContents = getDustCSV(dustData);
        const gasAnalyzerCSVContents = getGasCSV(gasAnalyzerCheckData.measurements, gasAnalyzerCheckData.timeBefore, gasAnalyzerCheckData.timeAfter);
        const aspirationCSVContents = getAspirationCSV(aspirationData)


        const output = [
            homeCSVContents,
            personnelCSVContents,
            utilitiesCSVContents,
            flowsCSVContents,
            h2oCSVContents,
            dustCSVContents,
            gasAnalyzerCSVContents,
            aspirationCSVContents]
            .join("\n");

        console.log(output)
        return output;
    }

    async restoreGlobalStateFromCSV(csvContents: string) {
        // split the file into separate parts
        console.log("Restoring global state from CSV...")
        const [homeCSVContents, rest1] = csvContents.split(UTILITIES_SCREEN_CSV_HEADING);
        console.log("Parsed Home Screen contents: " + homeCSVContents.trim());
        const [utilitiesCSVContents, rest2] = rest1.split(FLOWS_SCREEN_CSV_HEADING);
        console.log("Parsed Utilities Screen contents: " + utilitiesCSVContents.trim());
        const [flowsCSVContents, rest3] = rest2.split(H2O_SCREEN_CSV_HEADING);
        console.log("Parsed Flows Screen contents: " + flowsCSVContents.trim());
        const [h2oCSVContents, rest4] = rest3.split(DUST_SCREEN_CSV_HEADING);
        console.log("Parsed H2O Screen contents: " + h2oCSVContents.trim());
        const [dustCSVContents, rest5] = rest4.split(ANALYSER_SCREEN_CSV_HEADING);
        console.log("Parsed Dust Screen contents: " + dustCSVContents.trim());
        const [gasAnalyzerCSVContents, aspirationCSVContents] = rest5.split(ASPIRATION_SCREEN_CSV_HEADING);
        console.log("Parsed Gas Analyzer Check Screen contents: " + gasAnalyzerCSVContents.trim());
        console.log("Parsed Aspiration Screen contents: " + aspirationCSVContents.trim());

        const utilitiesData: UtilitiesInternalStorageState = restoreUtilitiesDataFromCSV(('' + utilitiesCSVContents).trim());
        const flowsData: SingleFlowMeasurement[] = restoreFlowsDataFromCSV(('' + flowsCSVContents).trim());
        const h2oData: H2OMeasurement[] = restoreH2ODataFromCSV(('' + h2oCSVContents).trim());
        const dustData: DustMeasurement[] = restoreDustDataFromCSV(('' + dustCSVContents).trim());
        const aspirationData: AspirationMeasurement[] = restoreAspirationDataFromCSV(('' + aspirationCSVContents).trim());
        const gasAnalyzerCheckData: GasAnalyzerCheckData = restoreGasDataFromCSV(('' + gasAnalyzerCSVContents).trim());
        const homeData: HomeScreenInformationData = restoreHomeDataFromCSV(('' + homeCSVContents).trim());

        this.persistScreenData(utilitiesData, UTILITIES_INTERNAL_STORAGE_FILE_NAME);
        this.persistScreenData(flowsData, FLOWS_INTERNAL_STORAGE_FILE_NAME);
        this.persistScreenData(h2oData, H2O_INTERNAL_STORAGE_FILE_NAME);
        this.persistScreenData(dustData, DUST_INTERNAL_STORAGE_FILE_NAME);
        this.persistScreenData(aspirationData, ASPIRATION_INTERNAL_STORAGE_FILE_NAME);
        this.persistScreenData(gasAnalyzerCheckData, GAS_ANALYSER_CHECK_INTERNAL_STORAGE_FILE_NAME);
        this.persistScreenData(homeData, HOME_SCREEN_INTERNAL_STORAGE_FILE_NAME);
    }
    async loadScreenData<T>(internalStorageFileName: string): Promise<T> {
        return this.fileSystemService.loadJSONFromInternalStorage(internalStorageFileName).then(loadedData => loadedData as T)
    }
    async persistScreenData(data: Object, internalStorageFileName: string) {
        await this.fileSystemService.saveObjectToInternalStorage(data, internalStorageFileName);
    }
}

const parseDates = (data: GasAnalyzerCheckData) => {
    data.timeBefore = new Date(data.timeBefore);
    data.timeAfter = new Date(data.timeAfter);
    return data;
};

export default GlobalSaveService;