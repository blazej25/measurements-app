import { FLOWS_INTERNAL_STORAGE_FILE_NAME, FLOWS_SCREEN_CSV_HEADING } from "../screens/FlowsScreen";
import { HOME_SCREEN_CSV_HEADING, HOME_SCREEN_INTERNAL_STORAGE_FILE_NAME, PERSONNEL_CSV_HEADING } from "../screens/HomeScreen";
import FileSystemService from "./FileSystemService";

class GlobalSaveService {
    async performGlobalSave(fileName: String) {
        // Read state from internal storage for all screens
        const fileService = new FileSystemService();
        const data: Promise<Object> = fileService.loadJSONFromInternalStorage(FLOWS_INTERNAL_STORAGE_FILE_NAME);




    }
}

export default GlobalSaveService;
