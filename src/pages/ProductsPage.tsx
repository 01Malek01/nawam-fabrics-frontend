import { useParams } from 'react-router-dom'

export default function ProductsPage() {
    // const [products, setProducts] = React.useState([]);
    const {categoryId, subCategoryId} = useParams();
    console.log(' categoryId',categoryId, 'subCategoryId', subCategoryId);
  return (
    <div>
        Filtered products go here
    </div>
  )
}
