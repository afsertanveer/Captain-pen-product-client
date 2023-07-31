import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import AddAdmin from "../Pages/AddAdmin/AddAdmin";
import AddPrimaryItem from "../Pages/AddPrimaryItem/AddPrimaryItem";
import AddRegion from "../Pages/AddRegion/AddRegion";
import Login from "../Pages/Login/Login";
import ShowItems from "../Pages/ShowItems.js/ShowItems";
import AddProduct from "./../Pages/AddProduct/AddProduct";
import ShowProducts from "../Pages/ShowProducts/ShowProducts";
import DistributeProducts from "./../Pages/DistributeProducts/DistributeProducts";
import Home from "../Pages/Home/Home";
import AddASM from "../Pages/AddASM/AddASM";
import AddSR from "./../Pages/AddSR/AddSR";
import ShowDistributedProducts from "../Pages/ShowDistributedProducts/ShowDistributedProducts";
import AvailableProduct from "../Pages/AvailableProduct/AvailableProduct";
import ShowRegion from "../Pages/ShowRegion/ShowRegion";
import AssignAdmin from "../Pages/AssignAdmin/AssignAdmin";
import AddShop from "../Pages/AddShop/AddShop";
import ShowUsers from './../Pages/ShowUsers/ShowUsers';
import ShowShops from "../Pages/ShowShops/ShowShops";
import ShowAllShops from './../Pages/ShowShops/ShowAllShops';
import DistributeToSr from './../Pages/DistributeToSr/DistributeToSr';
import MySR from "../Pages/MySR/MySR";
import RecievedProduct from "../Pages/RecievedProduct/RecievedProduct";
import AvailableProductSr from "../Pages/AvailableProduct/AvailableProductSr";
import DistributeToShop from './../Pages/DistributeToShop/DistributeToShop';
import ShowShopDistribution from "../Pages/ShowShopDistribution/ShowShopDistribution";
import ChangePassword from "../Shared/ChangePassword/ChangePassword";
import AddCV from './../Pages/AddCV/AddCV';
import ShowCV from "../Pages/AddCV/ShowCV";
import ShopTransaction from './../Pages/ShopTransaction/ShopTransaction';
import ReturnSr from "../Pages/ReturnSr/ReturnSr";
import ViewCategories from './../Pages/ViewCategories/ViewCategories';
import AddCategory from './../Pages/AddCategory/AddCategory';
import AddSecondaryCategory from "../Pages/AddCategory/AddSecondaryCategory";
import ViewSecondaryCategory from './../Pages/ViewCategories/ViewSecondaryCategory';
import MyASM from "../Pages/MyASM/MyASM";
import SuperSR from "../Pages/MySR/SuperSR";
import DistributeToSuperSr from './../Pages/DistributeToSr/DistributeToSuperSr';
import SrUnderAdmin from "../Pages/MySR/SrUnderAdmin";
import ShopUnderAdmin from './../Pages/ShowShops/ShopUnderAdmin';
import SalesReport from "../Shared/Reports/SalesReport";
import CashCollection from "../Shared/Reports/CashCollection";
import ProductStock from "../Shared/Reports/ProductStock";
import ShopReport from "../Shared/Reports/ShopReport";
import ProductSalesReport from "../Shared/Reports/ProductSalesReport";
import ProductSendAdminToASM from "../Shared/Reports/ProductSendAdminToASM";
import ProductSendASMToSR from "../Shared/Reports/ProductSendASMToSR";
import AddUnit from "../Pages/Factory/AddUnit";
import ShowUnit from "../Pages/Factory/ShowUnit";
import AddFactoryItem from "../Pages/Factory/AddFactoryItem";
import ShowFactoryItem from "../Pages/Factory/ShowFactoryItem";
import FactoryReport from "../Pages/Factory/FactoryReport";
import AddAndAssignShop from "../Pages/AddShop/AddAndAssignShop";
import ShopUnderASM from "../Pages/ShowShops/ShopUnderASM";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login></Login>,
  },
  {
    path: "/",
    element: <Main></Main>,
    children: [
      {
        path: "/home",
        element: <Home></Home>,
      },
      {
        path:'/addshop',
        element:<AddShop></AddShop>
      },
      {
        path:'/addshopbyothers',
        element:<AddAndAssignShop></AddAndAssignShop>
      },
      {
        path: "/addregion",
        element: <AddRegion></AddRegion>,
      },
      {
        path:'/viewregion',
        element:<ShowRegion></ShowRegion>
      },
      {
        path:'/view-shops',
        element:<ShowShops></ShowShops>
      },
      {
        path:'/show-all-shops',
        element:<ShowAllShops></ShowAllShops>
      },
      {
        path:'/show-asm-shops',
        element:<ShopUnderASM></ShopUnderASM>
      },
      {
        path:'/show-cv/:id',
        element:<ShowCV></ShowCV>
      },
      {
        path:'/view-users',
        element:<ShowUsers></ShowUsers>
      },
      {
        path: "/addadmin",
        element: <AddAdmin></AddAdmin>,
      },
      {
        path: "/add-asm",
        element: <AddASM></AddASM>,
      },
      {
        path: "/add-sr",
        element: <AddSR></AddSR>,
      },
      {
        path: "/add-cv",
        element: <AddCV></AddCV>,
      },
      {
        path: "/my-sr",
        element: <MySR></MySR>
      },
      {
        path: "/sr-under-me",
        element: <SrUnderAdmin></SrUnderAdmin>
      },
      {
        path: "/super-sr",
        element: <SuperSR></SuperSR>
      },
      {
        path: "/my-asm",
        element: <MyASM></MyASM>
      },
      {
        path: "/add-primary-item",
        element: <AddPrimaryItem></AddPrimaryItem>,
      },
      {
        path: "/addproduct",
        element: <AddProduct></AddProduct>,
      },
      {
        path: "/show-items",
        element: <ShowItems></ShowItems>,
      },
      {
        path: "/shop-under-me",
        element: <ShopUnderAdmin></ShopUnderAdmin>,
      },
      {
        path: "/add-category/:id",
        element: <AddCategory></AddCategory>,
        loader: ({ params }) => {
          return fetch(`http://localhost:5000/items/${params.id}`);
        },
      },
      {
        path: "/add-category-secondary/:id",
        element: <AddSecondaryCategory></AddSecondaryCategory>,
        loader: ({ params }) => {
          return fetch(`http://localhost:5000/item-layers?item_id=${params.id}`);
        },
      },
      {
        path: "/assign-admin/:id",
        element: <AssignAdmin></AssignAdmin>,
        loader: ({ params }) => {
          return fetch(`http://localhost:5000/region/${params.id}`);
        },
      },
      {
        path: "/view-category/:id",
        element: <ViewCategories></ViewCategories>,
        loader: ({ params }) => {
          return fetch(`http://localhost:5000/item-layers?item_id=${params.id}`);
        },
      },
      {
        path: "/view-secondary-category/:id",
        element: <ViewSecondaryCategory></ViewSecondaryCategory>,
        loader: ({ params }) => {
          return fetch(`http://localhost:5000/item-layers?item_id=${params.id}`);
        },
      },
      {
        path: "/show-product",
        element: <ShowProducts></ShowProducts>,
      },
      {
        path:'/recieved-product',
        element:<RecievedProduct></RecievedProduct>
      },
      {
        path: "/distribute-product",
        element: <DistributeProducts></DistributeProducts>,
      },
      {
        path: "/distribute-product-to-sr",
        element: <DistributeToSr></DistributeToSr>,
      },
      {
        path: "/distribute-product-super-sr",
        element: <DistributeToSuperSr></DistributeToSuperSr>,
      },
      {
        path: "/return-product-from-sr",
        element: <ReturnSr></ReturnSr>
      },
      {
        path: "/show-distributed-product",
        element: <ShowDistributedProducts></ShowDistributedProducts>,
      },
      {
        path: "/distribute-product-to-shop",
        element: <DistributeToShop></DistributeToShop>,
      },
      {
        path: "/shop-transaction",
        element: <ShopTransaction></ShopTransaction>,
      },
      {
        path: "/available-product",
        element: <AvailableProduct></AvailableProduct>,
      },
      {
        path: "/available-product-sr",
        element: <AvailableProductSr></AvailableProductSr>
      },
      {
        path: "/distribution-to-shop",
        element: <ShowShopDistribution></ShowShopDistribution>
      },
      {
        path: "/change-password",
        element: <ChangePassword></ChangePassword>
      },
      {
        path: "/sales-report",
        element: <SalesReport></SalesReport>
      },
      {
        path: "/shop-report",
        element: <ShopReport></ShopReport>
      },
      {
        path: "/cash-collection-report",
        element: <CashCollection></CashCollection>
      },
      {
        path: "/product-stock-report",
        element: <ProductStock></ProductStock>
      },
      {
        path: "/product-sales-report",
        element: <ProductSalesReport></ProductSalesReport>
      },
      {
        path: "/admin-send-product-report",
        element: <ProductSendAdminToASM></ProductSendAdminToASM>
      },
      {
        path: "/asm-send-product-report",
        element: <ProductSendASMToSR></ProductSendASMToSR>
      },
      {
        path: "/add-unit",
        element: <AddUnit></AddUnit>
      },
      {
        path: "/show-unit",
        element: <ShowUnit></ShowUnit>
      },
      {
        path: "/add-factory-item",
        element: <AddFactoryItem></AddFactoryItem>
      },
      {
        path: "/show-factory-item",
        element: <ShowFactoryItem></ShowFactoryItem>
      },
      {
        path: "/factory-report",
        element: <FactoryReport></FactoryReport>
      }
    ],
  },
]);
export default router;
