import Link from 'next/link';
import Card from '@/components/Card';

const RecentModifiedForms = ({ title, forms }) => {
  return (
    <Card>
      <header className="p-5 pb-4 border-b border-slate-100">
        <h2 className="font-medium text-[#1E293B]">{title}</h2>
      </header>
      <div className="p-5 overflow-y-auto ">
        <div>
          <header className="flex justify-between p-2 text-xs uppercase rounded-sm text-slate-400 bg-slate-50">
            <span>Name</span>
            {(forms[0]?.editUrl || forms[0]?.viewUrl) && <span>Action</span>}
          </header>
          <ul className="my-1">
            {forms?.length === 0 && <p className="px-2 py-2">No data found</p>}
            {forms?.map((data) => (
              <li key={data.id} className="flex px-2">
                <div className="flex items-center py-2 text-sm border-b grow border-slate-100">
                  <div className="flex justify-between grow">
                    <div className="self-center">
                      <p className="font-medium text-[#1E293B] hover:text-slate-900">
                        {data.name}
                      </p>
                    </div>
                    <div className="flex self-end gap-3 ml-2 shrink-0">
                      {data.editUrl && (
                        <Link
                          className="text-indigo-500 hover:text-indigo-600"
                          href={data.editUrl}
                        >
                          Edit
                        </Link>
                      )}

                      {data.viewUrl && (
                        <Link
                          className="text-indigo-500 hover:text-indigo-600"
                          href={data.viewUrl}
                        >
                          Get data
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default RecentModifiedForms;
