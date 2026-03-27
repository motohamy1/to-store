import { Models } from "node-appwrite";
import Link from "next/link";

import ActionDropdown from "@/components/ActionDropdown";
import { FormattedDateTime } from "@/components/FormattedDateTime";
import { Thumbnail } from "@/components/Thumbnail";
import { getFiles } from "@/lib/actions/file.actions";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { getFileTypesParams } from "@/lib/utils";

const Page = async ({ params }: { params: Promise<{ type: string }> }) => {
  const { type } = await params;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <div className="dashboard-container">
        <p className="text-light-100">Please sign in to view files.</p>
      </div>
    );
  }

  const files = await getFiles({
    types: getFileTypesParams(type),
    accountId: currentUser.accountId,
  });

  return (
    <div className="dashboard-container">
      <div className="dashboard-recent-files">
        <h2 className="h3 xl:h2 text-light-100 capitalize">
          {type === "others" ? "Others" : type}
        </h2>
        {files.documents.length > 0 ? (
          <ul className="mt-5 flex flex-col gap-5">
            {files.documents.map((file: Models.Document) => (
              <Link
                href={file.url}
                target="_blank"
                className="flex items-center gap-3"
                key={file.$id}
              >
                <Thumbnail
                  type={file.type}
                  extension={file.extension}
                  url={file.url}
                />

                <div className="recent-file-details">
                  <div className="flex flex-col gap-1">
                    <p className="recent-file-name">{file.name}</p>
                    <FormattedDateTime
                      date={file.$createdAt}
                      className="caption"
                    />
                  </div>
                  <ActionDropdown file={file} />
                </div>
              </Link>
            ))}
          </ul>
        ) : (
          <p className="empty-list">No {type} found</p>
        )}
      </div>
    </div>
  );
};

export default Page;
