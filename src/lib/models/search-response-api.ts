import { Message } from './message.model';
import { SearchField } from './search-field';

export class SearchResponseApi {
    public title: string;
    public data: any;
    public columns: Array<SearchField>;
    public messages: Array<Message>;
}
