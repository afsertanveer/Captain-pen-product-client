import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import AddAdmin from "../Pages/AddAdmin/AddAdmin";
import AddCategory from "../Pages/AddCategory/AddCategory";
import AddPrimaryItem from "../Pages/AddPrimaryItem/AddPrimaryItem";
import AddRegion from "../Pages/AddRegion/AddRegion";
import Login from "../Pages/Login/Login";
import ShowItems from "../Pages/ShowItems.js/ShowItems";
import EditCategory from "./../Pages/EditCategory/EditCategory";
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
import AddCategoryTry from "../Pages/AddCategory/AddCategoryTry";

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
        path:'/show-cv',
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
      // {
      //   path: "/add-category/:id",
      //   element: <AddCategory></AddCategory>,
      //   loader: ({ params }) => {
      //     return fetch(`http://localhost:5000/items/${params.id}`);
      //   },
      // },
      {
        path: "/add-category/:id",
        element: <AddCategoryTry></AddCategoryTry>,
        loader: ({ params }) => {
          return fetch(`http://localhost:5000/items/${params.id}`);
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
        path: "/edit-category/:id",
        element: <EditCategory></EditCategory>,
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
    ],
  },
]);
export default router;
