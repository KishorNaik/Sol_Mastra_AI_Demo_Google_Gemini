import { StatusCodes } from "http-status-codes";
import { ResultError, ResultExceptionFactory } from "../../../../../utils/exception";
import { IServiceHandlerAsync } from "../../../../../utils/helpers/services";
import { AxiosHelper } from "../../../../../utils/helpers/axios";
import { BASE_URL, ENCRYPTION_KEY } from "../../../../../config/env";
import { AesResponseDto, DataResponse } from "../../../../../utils/models/response";
import { AES } from "../../../../../utils/helpers/aes";
import { Ok, Result } from "neverthrow";

export interface ISearchTodosApiServiceParameters {
	title?: string;
}

export interface ISearchTodosApiServiceResult{
    identifier: string;
    title: string;
    description: string;
    isCompleted: boolean;
}

export interface ISearchTodosApiService extends IServiceHandlerAsync<ISearchTodosApiServiceParameters,ISearchTodosApiServiceResult[]>{}

export class SearchTodosApiService implements ISearchTodosApiService{
  public async handleAsync(params: ISearchTodosApiServiceParameters): Promise<Result<ISearchTodosApiServiceResult[], ResultError>> {
    try
    {
      //@guard
      if(!params)
      return ResultExceptionFactory.error(StatusCodes.BAD_REQUEST,'Invalid Request');

      // Create an Instance of Axios Helper
      const axiosHelper: AxiosHelper = new AxiosHelper({
        baseURL: String(BASE_URL),
      });

      // get title
      const {title}=params;

      // Set Url
      const url=`/api/v1/todos?pageSize=15&pageNumber=1&title=${title}`;

      // Make Request
      const responseResult=await axiosHelper.getAsync<AesResponseDto>(url);
      if (responseResult.isErr())
				return ResultExceptionFactory.error(
					responseResult.error.statusCode,
					responseResult.error.message
				);

      const response: DataResponse<AesResponseDto> = responseResult.value;
      if (!response.Success)
        return ResultExceptionFactory.error(response.StatusCode!, response.Message!);

      // Decrypt Body
      const aesResponseBodyDto: AesResponseDto = response.Data!;
      if (!aesResponseBodyDto.body)
        return ResultExceptionFactory.error(StatusCodes.NOT_FOUND, `Body not found`);

      const aes = new AES(String(ENCRYPTION_KEY));
      const decryptResponseBody = await aes.decryptAsync(aesResponseBodyDto.body!);
      if (!decryptResponseBody)
        return ResultExceptionFactory.error(
          StatusCodes.NOT_ACCEPTABLE,
          'Failed to decrypt response body'
        );

      const responseBody: ISearchTodosApiServiceResult[] = JSON.parse(decryptResponseBody);
      if (!responseBody)
        return ResultExceptionFactory.error(
          StatusCodes.NOT_ACCEPTABLE,
          'Failed to parse response body'
        );

      return new Ok(responseBody);
    }
    catch(ex){
      const error=ex as Error;
      return ResultExceptionFactory.error(StatusCodes.INTERNAL_SERVER_ERROR,error.message);
    }
  }

}