import { FC, useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Pagination,
  Spinner,
  PaginationItemValue,
} from "@nextui-org/react";
import PropertyCard from "./PropertyCard";
import SinglePropertyDetail from "./SinglePropertyDetail";
import { MapboxGeoJSONFeature } from "mapbox-gl";

const tableCols = [
  {
    key: "ADDRESS",
    label: "Address",
  },
  {
    key: "guncrime_density",
    label: "Crime Rate",
  },
  {
    key: "tree_canopy_gap",
    label: "Canopy Gap",
  },
];

interface PropertyDetailSectionProps {
  featuresInView: MapboxGeoJSONFeature[];
  display: "detail" | "list";
  loading: boolean;
  selectedProperty: MapboxGeoJSONFeature | null;
  setSelectedProperty: (property: MapboxGeoJSONFeature | null) => void;
}

const PropertyDetailSection: FC<PropertyDetailSectionProps> = ({
  featuresInView,
  display,
  loading,
  selectedProperty,
  setSelectedProperty,
}) => {
  const [page, setPage] = useState(1);

  const rowsPerPage = 6;
  const pages = Math.ceil(featuresInView.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return featuresInView.slice(start, end);
  }, [page, featuresInView]);

  return loading ? (
    <Spinner />
  ) : selectedProperty ? (
    <SinglePropertyDetail
      property={selectedProperty}
      setSelectedProperty={setSelectedProperty}
    />
  ) : (
    <>
      <div className="flex flex-wrap overflow-y-auto max-h-[calc(100vh-110px)]">
        {display === "list" ? (
          <Table
            aria-label="Property Details"
            radius="none"
            removeWrapper
            classNames={{
              th: "bg-white",
            }}
          >
            <TableHeader>
              {tableCols.map((column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              ))}
            </TableHeader>
            <TableBody items={items}>
              {({ properties }) => (
                <TableRow
                  key={properties?.OPA_ID}
                  onClick={() => {
                    setSelectedProperty(
                      items.find(
                        (item) =>
                          properties?.OPA_ID === item?.properties?.OPA_ID
                      ) || null
                    );
                  }}
                >
                  {(columnKey) => (
                    <TableCell>{getKeyValue(properties, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        ) : (
          items.map((feature, index) => (
            <PropertyCard
              feature={feature}
              key={index}
              setSelectedProperty={setSelectedProperty}
            />
          ))
        )}
        {featuresInView?.length > 0 && (
          <div>
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
                page={page}
                getItemAriaLabel={(page) => {
                  if (page === 'next') return 'Go to next page';
                  if (page === 'prev') return 'Go to previous page';
                  if (page === 'dots') return 'Jump 5 pages';
                  return `Go to page ${page}`;
                }}
                total={pages}
                onChange={(newPage) => setPage(newPage)}
              />
            </div>
            <div className="flex w-full justify-center p-2">
              <p className="text-sm text-gray-500">
                Note: only the first 100 properties can be viewed in list.
                Filter or zoom in to a smaller area to see more detail.{" "}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );

};

export default PropertyDetailSection;
