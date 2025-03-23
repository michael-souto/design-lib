import { ActivatedRoute, Router } from "@angular/router";
import { FrameworkService } from "projects/design-lib/src/lib/services/framework.service";
import { FunctionsService } from "projects/design-lib/src/lib/services/functions.service";

export class DetailCrudHelper<T> {

  public currentItem: T;
  public newIds: string[] = [];
  public displayDialog: boolean = false;
  private detailList: T[];
  private url: string;
  private router: Router;
  private activateRoute: ActivatedRoute;

  private createNewInstance: () => T;
  private postAddCallback?: (item: T) => void;
  private postNewItemCallback?: (item: T) => void;
  private postEditItemCallback?: (item: T) => void;
  private resetCurrentItemCallback?: () => T;

  constructor(
    createNewInstance: () => T,
    postAddCallback?: (item: T) => void,
    postNewItemCallback?: (item: T) => void,
    postEditItemCallback?: (item: T) => void,
    resetCurrentItemCallback?: () => T
  ) {
    this.createNewInstance = createNewInstance;
    this.postAddCallback = postAddCallback;
    this.postNewItemCallback = postNewItemCallback;
    this.postEditItemCallback = postEditItemCallback;
    this.currentItem = this.createNewInstance();
    this.resetCurrentItemCallback = resetCurrentItemCallback;
  }

  private resetCurrentItem(): void {
    if (this.resetCurrentItemCallback) {
      this.currentItem = this.resetCurrentItemCallback();
    } else {
      this.currentItem = this.createNewInstance();
    }
  }

  public newItem(
    detailList: T[],
    url: string,
    router: Router,
    activateRoute: ActivatedRoute
  ): void {
    this.resetCurrentItem();
    this.detailList = detailList;
    this.showDialog(true);
    if (url) {
      this.url = url;
      this.router = router;
      this.activateRoute = activateRoute;
      router.navigate([url], { relativeTo: activateRoute });
    }
    if (this.postNewItemCallback) {
      this.postNewItemCallback(this.currentItem);
    }
  }

  public editItem(
    item: T,
    url: string,
    router: Router,
    activateRoute: ActivatedRoute
  ): void {
    this.currentItem = item;
    this.showDialog(true);

    if (url) {
      this.url = url;
      this.router = router;
      this.activateRoute = activateRoute;
      router.navigate([url], { relativeTo: activateRoute });
    }
    if (this.postEditItemCallback) {
      this.postEditItemCallback(this.currentItem);
    }
  }

  public saveItem(): void {
    if (this.postAddCallback) {
      this.postAddCallback(this.currentItem);
    }
    FunctionsService.addItemListGridString(
      this.currentItem,
      this.detailList,
      this.newIds
    );
    this.resetCurrentItem();
    this.showDialog(false);
    if (this.url) {
      this.router.navigate(["./"], { relativeTo: this.activateRoute });
    }
  }

  public removeItem(item: T, list: T[]): void {
    this.detailList = list;
    FunctionsService.removeItemListGridString(
      item,
      this.detailList,
      this.newIds
    );
  }

  public showDialog(display: boolean): void {
    this.displayDialog = display;
  }

  public beforeSave(): void {
    FunctionsService.atribbuirNullEmIdsString(this.newIds, this.detailList);
  }

  public afterSave(): void {
    FunctionsService.recarregarIdsString(this.newIds, this.detailList);
  }
}
