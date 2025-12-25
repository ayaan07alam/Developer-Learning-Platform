"use client";

/**
 * PostStatusBadge component for displaying post status with appropriate styling
 * 
 * Usage:
 * <PostStatusBadge status="PUBLISHED" />
 */
export default function PostStatusBadge({ status }) {
    const getStatusStyle = (status) => {
        switch (status) {
            case 'DRAFT':
                return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
            case 'UNDER_REVIEW':
                return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'APPROVED':
                return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'PUBLISHED':
                return 'bg-primary/10 text-primary border-primary/20';
            case 'REJECTED':
                return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'ARCHIVED':
                return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
            default:
                return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'DRAFT':
                return 'Draft';
            case 'UNDER_REVIEW':
                return 'Under Review';
            case 'APPROVED':
                return 'Approved';
            case 'PUBLISHED':
                return 'Published';
            case 'REJECTED':
                return 'Rejected';
            case 'ARCHIVED':
                return 'Archived';
            default:
                return status;
        }
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(status)}`}>
            {getStatusLabel(status)}
        </span>
    );
}
