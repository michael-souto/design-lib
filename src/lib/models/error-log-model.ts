import { UtilsService } from "../services/utils/utils.service";
import { GenericEntity } from "./generic-entity.model";

export class ErrorLog extends GenericEntity {
  status: number;
  statusText: string;
  url: string;
  ok: boolean;
  name: string;
  message: string;
  timestamp: string;
  title: string;
  detail: string;
  path: string;
}

export function convertToErrorLog(httpErrorResponse: any): ErrorLog {
  const errorLog: ErrorLog = {
    id: UtilsService.generateUUID(),
    status: httpErrorResponse.status,
    statusText: httpErrorResponse.statusText,
    url: httpErrorResponse.url,
    ok: httpErrorResponse.ok,
    name: httpErrorResponse.name,
    message: httpErrorResponse.message,
    timestamp: httpErrorResponse.error.timestamp,
    title: httpErrorResponse.error.title,
    detail: httpErrorResponse.error.detail,
    path: httpErrorResponse.error.path,
  };

  return errorLog;
}
