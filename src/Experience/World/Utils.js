import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

export function copySkinningModel(original) {
    return SkeletonUtils.clone(original);
}

export function copyModel(original) {
    const clone = original.clone(true);

    const originalMeshes = [];
    const clonedMeshes = [];

    original.traverse(child => {
        if (child.isMesh) {
            originalMeshes.push(child);
        }
    });

    clone.traverse(child => {
        if (child.isMesh) {
            clonedMeshes.push(child);
        }
    });

    if (originalMeshes.length !== clonedMeshes.length) {
        console.warn('Mesh count mismatch between original and clone.');
    }

    for (let i = 0; i < originalMeshes.length; i++) {
        const origMesh = originalMeshes[i];
        const cloneMesh = clonedMeshes[i];

        if (origMesh.geometry) {
            cloneMesh.geometry = origMesh.geometry.clone();
        }

        if (origMesh.material) {
            if (Array.isArray(origMesh.material)) {
                cloneMesh.material = origMesh.material.map(mat => mat.clone());
            } else {
                cloneMesh.material = origMesh.material.clone();
            }
        }
    }

    return clone;
}
