
import { useNavigate } from 'react-router-dom';
import FabricCard from './FabricCard';
import FilterMenu from './FilterMenu';

const Fabrics = () => {
  const navigate    = useNavigate();
  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-black dark:text-white min-h-screen p-3">
      <div className="flex flex-col md:flex-row min-h-screen justify-between space-x-8 ">
        <aside className="py-5">
            <FilterMenu />
        </aside>
        
        {/* Main Content */}
          <main className=" w-full">

            {/* Products Grid */}               
              <div className="grid justify-center items-center md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {[
                  { 
                    id: 1 ,
                    name: 'Floral Cotton Print', 
                    price: '$12.99',
                    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgEn5bBp8A3v5TMgmG_Xy30ZssTkQ8uJQAkn9gjKJvFTKqVKFHIOVfsEWTffLVupooswoJqnDc2pwIS3RFtU8Y2nx3tuFu2A6cdTRVdJ-0zdiZBOmRiFOvmKQGlFK8ViKl_t7BjzhTIi-k9S3DqfghfDdi6L_x8J5uT-4nKcla4hFpaPprg2XU4LthpdL30Fbu88v8p-bqOjfnmxRs-Jhvu-JZQsTMUBEb-j5TB5P-GDg1712IqY5Fe-4yfiTk5UreQ_nUBDL02pY'
                  },
                  { 
                    id: 2,
                    name: 'Solid Silk Charmeuse', 
                    price: '$24.50',
                    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGFKFb0XMAZoDJ3i0o6KQsvl23rQv6cTGlNisBccWAXz5OuOPZtvWElfv6ToJ0qDhYK5G4Eu8OY68nqwRkxTPOVzdb-NyIoM3P3bWti8y6nlC8d-FBEKU54vThn_FDSKT8b93QEh5FOxUNufLYeImDujWoKnNqhygBjscj-CI8WwZFxvO5p8bfh_IDAF37FnS_5Qt3fsqzpzIvV1NwvVjBR-gKSvt6b2aFA0qL6BX9mXRYbKdZwIr22hV4QiB5lT38b0FNNkZF5w4'
                  },
                  { 
                    id: 3,
                    name: 'Striped Linen Blend', 
                    price: '$18.75',
                    image: 'https://example.com/fabric3.jpg'
                  },
                  { 
                    id: 4,
                    name: 'Wool Tweed', 
                    price: '$32.99',
                    image: 'https://example.com/fabric4.jpg'
                  },
                  { 
                    name: 'Cotton Voile', 
                    price: '$14.99',
                    image: 'https://example.com/fabric5.jpg'
                  },
                  { 
                    name: 'Satin Charmeuse', 
                    price: '$21.50',
                    image: 'https://example.com/fabric6.jpg'
                  }
                ].map((fabric) => (
                <FabricCard   buttonTitle='تصفح القماش' buttonAction={() => navigate(`/fabric/${fabric?.id}`)} fabric={fabric} />
                ))}
              </div>
          </main>
      </div>
    </div>
  );
};

export default Fabrics;
