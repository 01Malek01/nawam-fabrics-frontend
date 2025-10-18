// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useEffect, useState } from 'react';
import FabricCard from './FabricCard';
import { airtableService } from '../services/airtable';
import type { Fabric } from '@/types';
import { useNavigate } from 'react-router-dom';


const Fabrics = ({categoryId, subCategoryId}: {categoryId: string, subCategoryId?: string}) => {
    const navigate = useNavigate();
    const [fabrics, setFabrics] = useState<Fabric[]>([]);
    
    useEffect(() => {
      const fetchFabrics = async () => {
        try {
          const records = await airtableService.getAllRecords('Products');
          const filteredFabrics = records
            .filter((fabric: any) => 
              fabric.MainCategory?.includes(categoryId) && 
              (!subCategoryId || fabric.SubCategory?.includes(subCategoryId))
            )
            .map((fabric: any) => ({
              id: fabric.id,
              name: fabric.Name || 'Unnamed Fabric',
              price: fabric.PricePerMeter || 'جم0.00',
              image: fabric.Image?.[0]?.url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgEn5bBp8A3v5TMgmG_Xy30ZssTkQ8uJQAkn9gjKJvFTKqVKFHIOVfsEWTffLVupooswoJqnDc2pwIS3RFtU8Y2nx3tuFu2A6cdTRVdJ-0zdiZBOmRiFOvmKQGlFK8ViKl_t7BjzhTIi-k9S3DqfghfDdi6L_x8J5uT-4nKcla4hFpaPprg2XU4LthpdL30Fbu88v8p-bqOjfnmxRs-Jhvu-JZQsTMUBEb-j5TB5P-GDg1712IqY5Fe-4yfiTk5UreQ_nUBDL02pY',
              MainCategory: fabric.MainCategory,
              SubCategory: fabric.SubCategory
            } as Fabric));
            
          setFabrics(filteredFabrics);
        } catch (error) {
          console.error('Error fetching fabrics:', error);
        }
      };

      fetchFabrics();
    },[categoryId, subCategoryId])
    return (
    <div className="font-display bg-background-light dark:bg-background-dark text-black dark:text-white min-h-screen p-3">
      <div className="flex flex-col md:flex-row min-h-screen justify-between space-x-8 ">
        {/* <aside className="py-5">
            <FilterMenu />
        </aside> */}
        
        {/* Main Content */}
          <main className=" w-full">

            {/* Products Grid */}               
              <div className="grid justify-center items-center md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
               {fabrics?.map((fabric) => (
                <FabricCard 
                  key={fabric.id}
                  buttonTitle='تصفح القماش' 
                  href={`/fabric/${fabric.id}`}
                  fabric={fabric} 
                  buttonAction={() => navigate(`/fabric/${fabric.id}`)} 
                  
                />
                ))}
              </div>
          </main>
      </div>
    </div>
  );
};

export default Fabrics;
