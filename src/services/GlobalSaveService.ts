import { HomeScreenInformationData } from "../model";
import { FLOWS_INTERNAL_STORAGE_FILE_NAME, FLOWS_SCREEN_CSV_HEADING, SingleFlowMeasurement, exportMeasurementsAsCSV as getFlowsCSV } from "../screens/FlowsScreen";
import { GAS_ANALYSER_CHECK_INTERNAL_STORAGE_FILE_NAME, GasAnalyzerCheckData, exportMeasurementsAsCSV as getGasCSV } from "../screens/GasAnalyzerCheckScreen";
import { DUST_INTERNAL_STORAGE_FILE_NAME, DustMeasurement, exportMeasurementsAsCSV as getDustCSV } from "../screens/DustScreen";
import { H2O_INTERNAL_STORAGE_FILE_NAME, H2OMeasurement, exportMeasurementsAsCSV as geth2oCSV } from "../screens/H20_14790_Screen";
import { HOME_SCREEN_CSV_HEADING, HOME_SCREEN_INTERNAL_STORAGE_FILE_NAME, PERSONNEL_CSV_HEADING, exportMeasurementsAsCSV as getHomeCSV, exportPersonnelAsCSV } from "../screens/HomeScreen";
import { UTILITIES_INTERNAL_STORAGE_FILE_NAME, UtilitiesInternalStorageState, exportMeasurementsAsCSV as getUtilitiesCSV } from "../screens/UtilitiesScreen";
import FileSystemService from "./FileSystemService";
import { ASPIRATION_INTERNAL_STORAGE_FILE_NAME, AspirationMeasurement, exportMeasurementsAsCSV as getAspirationCSV } from "../screens/AspirationScreen";

class GlobalSaveService {
    fileSystemService: FileSystemService;

    constructor() {
        this.fileSystemService = new FileSystemService();
    }
    async getGlobalSaveCSVContents(): Promise<string> {
        const flowsData: SingleFlowMeasurement[] = await this.loadScreenData(FLOWS_INTERNAL_STORAGE_FILE_NAME);
        const gasAnalyzerCheckData: GasAnalyzerCheckData = await this.loadScreenData(GAS_ANALYSER_CHECK_INTERNAL_STORAGE_FILE_NAME);
        const dustData: DustMeasurement[] = await this.loadScreenData(DUST_INTERNAL_STORAGE_FILE_NAME);
        const h2oData: H2OMeasurement[] = await this.loadScreenData(H2O_INTERNAL_STORAGE_FILE_NAME);
        const utilitiesData: UtilitiesInternalStorageState = await this.loadScreenData(UTILITIES_INTERNAL_STORAGE_FILE_NAME);
        const aspirationData: AspirationMeasurement[] = await this.loadScreenData(ASPIRATION_INTERNAL_STORAGE_FILE_NAME);

        // TODO: figure out how it is saved
        const homeInformation: HomeScreenInformationData = await this.loadScreenData(HOME_SCREEN_INTERNAL_STORAGE_FILE_NAME);

        console.log(utilitiesData)

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
    async loadScreenData<T>(internalStorageFileName: string): Promise<T> {
        return this.fileSystemService.loadJSONFromInternalStorage(internalStorageFileName).then(loadedData => loadedData as T)
    }
}

export default GlobalSaveService;
