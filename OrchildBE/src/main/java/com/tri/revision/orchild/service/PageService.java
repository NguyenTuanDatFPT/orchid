package com.tri.revision.orchild.service;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
public class PageService {
    
    private static final int DEFAULT_PAGE_SIZE = 10;
    private static final int DEFAULT_PAGE_NUMBER = 0;
    
    /**
     * Create pageable with default settings
     */
    public Pageable createPageable(Integer page, Integer size) {
        int pageNumber = (page != null && page >= 0) ? page : DEFAULT_PAGE_NUMBER;
        int pageSize = (size != null && size > 0) ? size : DEFAULT_PAGE_SIZE;
        
        // Limit maximum page size to prevent performance issues
        if (pageSize > 100) {
            pageSize = 100;
        }
        
        return PageRequest.of(pageNumber, pageSize);
    }
    
    /**
     * Create pageable with sorting
     */
    public Pageable createPageable(Integer page, Integer size, String sortBy, String sortDirection) {
        int pageNumber = (page != null && page >= 0) ? page : DEFAULT_PAGE_NUMBER;
        int pageSize = (size != null && size > 0) ? size : DEFAULT_PAGE_SIZE;
        
        if (pageSize > 100) {
            pageSize = 100;
        }
        
        Sort sort = Sort.unsorted();
        if (sortBy != null && !sortBy.trim().isEmpty()) {
            Sort.Direction direction = Sort.Direction.ASC;
            if ("desc".equalsIgnoreCase(sortDirection)) {
                direction = Sort.Direction.DESC;
            }
            sort = Sort.by(direction, sortBy);
        }
        
        return PageRequest.of(pageNumber, pageSize, sort);
    }
    
    /**
     * Create pageable with default sorting by creation date descending
     */
    public Pageable createPageableWithDefaultSort(Integer page, Integer size) {
        return createPageable(page, size, "createAt", "desc");
    }
}
